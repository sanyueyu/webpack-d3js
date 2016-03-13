var d3 = require('d3');
var root = d3.select('#root');
var data = window.__data__;
var lenArr = data.eagleEyeLevelDOs.map(function(item) {
  return item.eagleEyeLevelInfos.length;
});
var lenMax = d3.max(lenArr);
var w = 1000;
var levelHeight = 70;
var rectTop = 15;
var rectHeight = 40;
var rectWidth = Math.floor(w / (2 * lenMax));
var rectGap = rectWidth / 2;
var h = levelHeight * data.levelCount;
var rectPosMap = {};
var svg = root.append('svg')
  .attr('width', w)
  .attr('height', h);
// draw levels
var levels = svg.append('g', 'leves')
  .attr('id', 'leves')
  .selectAll('react')
  .data(d3.range(data.levelCount))
  .enter()
  .append('rect')
  .attr('x', 0)
  .attr('y', function(d) {
    return d * levelHeight;
  })
  .attr('width', w)
  .attr('height', levelHeight)
  .attr('fill', function(d) {
    if (d%2) {
      return '#FDFFDC';
    } else {
      return '#FFFFFF';
    }
  });

// draw rects
var drawRect = function(obj, index) {
  var _con = svg.append('g').attr('id', '#level_' + index);
  var _total = obj.eagleEyeLevelInfos.length;
  var _left = (w - _total * rectWidth - (_total - 1) * rectGap) / 2;
  //var _left = Math.floor(w / _total) / 2 - rectWidth / 2;
  var _rectGap = Math.floor(w / _total) - rectWidth;
  _con.selectAll('rect')
    .data(obj.eagleEyeLevelInfos)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return _left + i * rectWidth + i * rectGap;
    })
    .attr('y', function(d, i) {
      return levelHeight * obj.rpcLevel + rectTop;
    })
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .each(function(d, i) {
      rectPosMap[d.appId] = [_left + i * rectWidth + i * rectGap + rectWidth / 2, levelHeight * obj.rpcLevel + rectTop + rectHeight / 2]
    })
    .attr('stroke', '#ddd')
    .attr('fill', '#fff');
  _con.selectAll('text')
    .data(obj.eagleEyeLevelInfos)
    .enter()
    .append('text')
    .text(function(d) {
      return d.serverName;
    })
    .attr('x', function(d, i) {
      return _left + i * rectWidth + i * rectGap + rectWidth / 2;
    })
    .attr('y', function(d, i) {
      return levelHeight * obj.rpcLevel + rectTop + rectHeight / 2 + 7;
    })
    .attr('text-anchor', 'middle');
};
data.eagleEyeLevelDOs.forEach(drawRect);

// draw lines
var dataLines = data.eagleEyeLinkDOs.filter(function(item) {
  if (rectPosMap[item.sourceId]&&rectPosMap[item.targetId]) {
    return true;
  } else {
    return false;
  }
});
var getX = function(x, x1) {
  if (x > x1) {
    return x - rectWidth / 2;
  } else if (x < x1) {
    return x + rectWidth / 2;
  } else {
    return x;
  }
};
var getY = function(y, y1) {
  if (y > y1) {
    return y - rectHeight / 2;
  } else if (y < y1) {
    return y + rectHeight / 2;
  } else {
    return y;
  }
};
svg.append('g')
  .attr('id', 'lines')
  .selectAll('line')
  .data(dataLines)
  .enter()
  .append('line')
  .attr('x1', function(d) {
    return rectPosMap[d.sourceId][0];
    //return getX(rectPosMap[d.sourceId][0], rectPosMap[d.targetId][0]);
  })
  .attr('y1', function(d) {
    //return rectPosMap[d.sourceId][1];
    return getY(rectPosMap[d.sourceId][1], rectPosMap[d.targetId][1])
  })
  .attr('x2', function(d) {
    return rectPosMap[d.targetId][0];
    //return getX(rectPosMap[d.targetId][0], rectPosMap[d.sourceId][0])
  })
  .attr('y2', function(d) {
    //return rectPosMap[d.targetId][1];
    return getY(rectPosMap[d.targetId][1], rectPosMap[d.sourceId][1])
  })
  .attr('stroke', '#000');

