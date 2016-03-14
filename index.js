var d3 = require('d3');
var root = d3.select('#root');
var data = window.__data__;
var lenArr = data.eagleEyeLevelDOs.map(function(item) {
  return item.eagleEyeLevelInfos.length;
});
var lenMax = d3.max(lenArr);
var w = 150 * lenMax;
var levelHeight = 100;
var rectTop = 30;
var rectHeight = 40;
var rectWidth = Math.floor(w / (2 * lenMax));
var rectGap = rectWidth / 2;
var h = levelHeight * (data.levelCount + 1);
var rectPosMap = {};
var svg = root.append('svg')
  .attr('width', w)
  .attr('height', h);

// draw levels
var levels = svg.append('g', 'levels')
  .attr('id', 'levels')
  .selectAll('react')
  .data(d3.range(data.levelCount + 1))
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
svg.select('#levels')
  .selectAll('text')
  .data(d3.range(data.levelCount + 1))
  .enter()
  .append('text')
  .text(function(d) {
    if (d === 0) {
      return 'rootLevel';
    } else {
      return 'rpcLevel:' + (d - 1);
    }
  })
  .attr('x', 20)
  .attr('y', function(d) {
    return d * levelHeight + levelHeight - 10;
  });

// tooltip
var div = root.append('div')
  .attr('id', 'tooltip')
  .style({
    opacity: 0,
    position: 'absolute',
    width: '160px',
    heith: '28px',
    padding: '2px',
    border: '1px solid #ccc',
    background: '#fff',
    'border-radius': '4px'
  });

// draw rects
var drawRect = function(obj, index) {
  var _idName = index !== undefined ? ('#level_' + index) : 'top';
  var _con = svg.append('g').attr('id', _idName);
  var _total = obj.eagleEyeLevelInfos.length;
  var _left = (w - _total * rectWidth - (_total - 1) * rectGap) / 2;
  var _rectGap = Math.floor(w / _total) - rectWidth;
  _con.selectAll('rect')
    .data(obj.eagleEyeLevelInfos)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return _left + i * rectWidth + i * rectGap;
    })
    .attr('y', function(d, i) {
      obj.rpcLevel = obj.rpcLevel === undefined ? -1 : obj.rpcLevel;
      return levelHeight * (obj.rpcLevel + 1) + rectTop;
    })
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .each(function(d, i) {
      rectPosMap[d.appId + '_' + obj.rpcLevel] = [_left + i * rectWidth + i * rectGap + rectWidth / 2, levelHeight * (obj.rpcLevel + 1) + rectTop + rectHeight / 2]
    })
    .attr('stroke', '#ddd')
    .attr('fill', '#fff')
    .style('cursor', 'pointer')
    .on('mouseover', function(d) {
      d3.select(this).attr('stroke-width', 2);
      div.transition()
        .duration(200)
        .style('opacity', 0.9);
      div.html('appId:' + d.appId 
               + '</br>devTL: ' + d.devTL
               + '</br>originClientName:' + d.originClientName
               + '</br>originServerName:' + d.originServerName
               + '</br>rpcType:' + d.rpcType
               + '</br>service:' + d.service
               + '</br>testTL:' + d.testTL)
        .style('width', '400px')
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('stroke-width', 1);
      div.transition()
        .duration(500)
        .style('opacity', 0);
    });
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
      return levelHeight * (obj.rpcLevel + 1) + rectTop + rectHeight / 2 + 7;
    })
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .on('mouseover', function(d) {
      d3.select(this).attr('stroke-width', 2);
      div.transition()
        .duration(200)
        .style('opacity', 0.9);
      div.html('appId:' + d.appId 
               + '</br>devTL: ' + d.devTL
               + '</br>originClientName:' + d.originClientName
               + '</br>originServerName:' + d.originServerName
               + '</br>rpcType:' + d.rpcType
               + '</br>service:' + d.service
               + '</br>testTL:' + d.testTL)
        .style('width', '400px')
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    })
    .on('mouseout', function(d) {
      d3.select(this).attr('stroke-width', 1);
      div.transition()
        .duration(500)
        .style('opacity', 0);
    });
};
drawRect({
    eagleEyeLevelInfos: [{
      appId: data.eagleEyeLevelDOs[0].eagleEyeLevelInfos[0].clientAppId,
      serverName: data.eagleEyeLevelDOs[0].eagleEyeLevelInfos[0].clientName
    }]
});
data.eagleEyeLevelDOs.forEach(drawRect);
// 定义箭头
var defs = svg.append('defs');
var arrowMarker = defs.append('marker')
  .attr('id', 'arrow')
  .attr('markerUnits', 'strokeWidth')
  .attr('markerWidth', '12')
  .attr('markerHeight', 12)
  .attr('viewBox', '0 0 12 12')
  .attr('refX', '6')
  .attr('refY', '6')
  .attr('orient', 'auto');
var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
arrowMarker.append('path')
  .attr('d', arrow_path)
  .attr('fill', '#000');
// 画连接直线
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
  .data(data.eagleEyeLinkDOs)
  .enter()
  .append('line')
  .attr('x1', function(d) {
    var _key = d.sourceId + '_' + (d.rpcLevel - 1);
    return rectPosMap[_key][0];
  })
  .attr('y1', function(d) {
    var _key = d.sourceId + '_' + (d.rpcLevel - 1);
    var _key1 = d.targetId + '_' + d.rpcLevel;
    return getY(rectPosMap[_key][1], rectPosMap[_key1][1])
  })
  .attr('x2', function(d) {
    var _key = d.targetId + '_' + d.rpcLevel;
    return rectPosMap[_key][0];
  })
  .attr('y2', function(d) {
    var _key = d.targetId + '_' + d.rpcLevel;
    var _key1 = d.sourceId + '_' + (d.rpcLevel - 1);
    return getY(rectPosMap[_key][1], rectPosMap[_key1][1])
  })
  .attr('marker-end', 'url(#arrow)')
  .attr('stroke', '#000')
  .style('cursor', 'pointer')
  .on('mouseover', function(d) {
    d3.select(this).attr('stroke-width', 3);
    div.transition()
      .duration(200)
      .style('opacity', 0.9);
    div.html('source:' + d.source + '</br>target: ' + d.target)
      .style('width', '400px')
      .style('left', d3.event.pageX + 'px')
      .style('top', d3.event.pageY - 28 + 'px');
  })
  .on('mouseout', function(d) {
    d3.select(this).attr('stroke-width', 1);
    div.transition()
      .delay(2000)
      .duration(500)
      .style('opacity', 0);
  });


