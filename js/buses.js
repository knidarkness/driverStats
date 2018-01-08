import * as d3 from "d3";
import * as gradients from './gradients';

const createRow = () => {
    const rectContainer = d3.select('#container').append("svg")
        .attr("width", '100%')
        .attr("height", 30);
    gradients.appendLargeGradient(rectContainer);
    gradients.appendMediumGradient(rectContainer);
    gradients.appendSmallGradient(rectContainer);
    return rectContainer;
};

const appendCircle = (row, rowPos, circleRadius, circleColor) => {
    row.append("circle")
        .attr("cx", (rowPos * 50) + 7.5)
        .attr("cy", 7.5)
        .attr("r", circleRadius)
        .attr("fill", circleColor);
};

const appendRect = (row, rowPos, intervalClass) => {
    row.append("rect")
        .attr("x", (rowPos * 50) + 10)
        .attr("y", 5)
        .style("fill", intervalClass)
        .attr("width", 50)
        .attr("height", 5);
};

const fillRowStopsDelta = (data, row) => {
    let circleRadius;
    let circleColor = "#ff0000";
    for(let rowPosition in data){
        if (data[rowPosition] > 600){
            circleRadius = 7.5;
            circleColor = "#ff6536";
        } else if (data[rowPosition] > 300){
            circleRadius = 6;
            circleColor = "#ff6536";
        } else if (data[rowPosition] > 60){
            circleRadius = 3;
            circleColor = "#ff6536";
        } else {
            circleRadius = 9;
            circleColor = "#fff";
        }

        appendCircle(row, rowPosition, circleRadius, circleColor);
    }
};

const fillRowIntervalsData = (data, row) => {
    let intervalClass;
    for(let rowPosition in data){
        if (data[rowPosition] > 5){
            intervalClass = 'url(#gradientLarge)';
        } else if (data[rowPosition] > 3){
            intervalClass = 'url(#gradientMedium)';
        } else if (data[rowPosition] > 1.5){
            intervalClass = 'url(#gradientSmall)';
        } else {
            intervalClass = '#f1f1f1';
        }
        appendRect(row, rowPosition, intervalClass);
    }
};

const groupDataByDriver = (data) => {
    const grouped = data.reduce ( (accum, event) => {
        const index = accum.findIndex( (row) => {
            return row[0] && row[0].drivername === event.drivername
        })

        if (index >= 0) { accum[index].push(event);}
        else {accum.push([event]) }

        return accum
    }, [])

    console.log(grouped);

    let groupedData = {};
    for(let row in data){
        if(groupedData[data[row]['drivername']] === undefined){
            groupedData[data[row]['drivername']] = [];
        }
        groupedData[data[row]['drivername']].push(data[row]);
    }
    return groupedData;
};

const splitDataIntoIntervals = (data, expectedSpeed) => {
    let intervals = [];
    let totalDistance = 0;
    let totalTime = 0;
    for(let row = 1; row < data.length; row++){
        if (data[row].event === 'stop'){ // on each stop we flush prev data
            intervals.push(Math.abs(totalDistance/totalTime - expectedSpeed));
            totalDistance = 0;
            totalTime = 0;
        }
        totalDistance += Number(data[row].distance);
        totalTime = Number(data[row].duration);
    }
    return intervals;
};

const getStopsDeltaData = (data, expectedSpeed) => {
    let stopDeltas = [];
    let totalDistance = 0;
    let totalDuration = 0;
    for(let interval = 0; interval < data.length; interval++){
        totalDuration += Number(data[interval].duration);
        totalDistance += Number(data[interval].distance);
        if(data[interval].event === 'stop'){
            stopDeltas.push(Math.abs(totalDuration - (totalDistance/expectedSpeed)));
        }
    }
    return stopDeltas;
};

d3.csv('data/busdata-temp.csv', ((err, data) => {

    const driversData = groupDataByDriver(data);

    for(let driver in driversData){
        const driverData  = driversData[driver];
        const row = createRow();
        fillRowIntervalsData(splitDataIntoIntervals(driverData, 16), row);
        fillRowStopsDelta(getStopsDeltaData(driverData, 16), row);
    }
}));
