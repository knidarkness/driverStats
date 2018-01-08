const appendGradient = (rectContainer, id, stops, color, colorMid) => {
    const gradientLarge = rectContainer.append("defs")
        .append("linearGradient")
        .attr("id", id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .attr("spreadMethod", "pad");

    gradientLarge.append("stop")
        .attr("offset",`${stops[0]}%`)
        .attr("stop-color", "#fff")
        .attr("stop-opacity", 1);

    gradientLarge.append("stop")
        .attr("offset",`${stops[1]}%`)
        .attr("stop-color", color)
        .attr("stop-opacity", 1);

    gradientLarge.append("stop")
        .attr("offset",`${stops[2]}%`)
        .attr("stop-color", color)
        .attr("stop-opacity", 1);

    gradientLarge.append("stop")
        .attr("offset",`${stops[3]}%`)
        .attr("stop-color", color)
        .attr("stop-opacity", 1);


    gradientLarge.append("stop")
        .attr("offset",`${stops[4]}%`)
        .attr("stop-color", "#fff")
        .attr("stop-opacity", 1);
};

const appendLargeGradient = (rectContainer) => {
    appendGradient(rectContainer, 'gradientLarge', [0, 30, 50, 70, 100], "#f00", "#fa0000");
};

const appendMediumGradient = (rectContainer) => {
    appendGradient(rectContainer, 'gradientMedium', [10, 40, 50, 60, 90], "#e00", "#fafafa");
};


const appendSmallGradient = (rectContainer) => {
    appendGradient(rectContainer, 'gradientSmall', [20, 49, 50, 51, 80], "#d00", "#f0f0f0");
};

module.exports = {
    appendSmallGradient: appendSmallGradient,
    appendMediumGradient: appendMediumGradient,
    appendLargeGradient: appendLargeGradient
};