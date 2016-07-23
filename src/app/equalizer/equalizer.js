import React, {Component} from 'react';

import Paper, {Color, Group, Path} from 'paper';

export class Equalizer extends Component {

  constructor() {
    super();

    this.state = {
      size: 140,
      id: 'equalizer-canvas',
      canvas: {
        width: 1,
        height: 1
      }
    };

    this.colourSets = [
      ['#ffbe4f', '#6bd2db', '#0c457d', '#0ea7b5'],
      ['#0093b0', '#3c484f', '#8d9da1', '#657375'],
      ['#0c4642', '#428d83', '#f7feeb', '#c6c898'],
      ['#a4c963', '#ecd12e', '#ecb751', '#ec8f42'],
      ['#03396c', '#005b96', '#6497b1', '#b3cde0'],
      ['#eb8c00', '#e0301e', '#a32020', '#dc6900'],
      ['#d4ffea', '#eecbff', '#feffa3', '#dbdcff'],
      ['#eb6841', '#cc2a36', '#4f372d', '#00a0b0']
    ].map((colours) => {
      return colours.map((c) => {
        return (new Color(c)).convert('hsl');
      });
    });

    this.colours = this.colourSets[0];

    this.translateSize = 0.5;

    this.translations = [
      [this.translateSize, 0],
      [0, this.translateSize],
      [-this.translateSize, 0],
      [0, -this.translateSize]
    ];

    this.fpsRatio = 1;

    this.fps = 60 / this.fpsRatio;
  }

  initComponent() {

    const elem = document.getElementsByTagName('equalizer')[0];

    const width = elem.offsetWidth;
    const height = elem.offsetHeight;

    const cols = Math.ceil(width / this.state.size);
    const rows = Math.ceil(height / this.state.size);

    this.setState({
      cols,
      rows,
      canvas: {
        width,
        height
      }
    });

    setTimeout(() => {
      this.initCanvas();
      this.renderGrid();
    }, 10);
  }

  componentDidMount() {
    this.initComponent();
  }

  getIndex(r, c) {

    const colIndex = c % this.colours.length;

    const rowIndex = r % this.colours.length;

    if(colIndex % 2 === 0){
      return (rowIndex % 2 === 0) ? 0 : 3;
    } else{
      return (rowIndex % 2 === 0) ? 1 : 2;
    }
  }

  addRect(r, c) {

    const size = this.state.size;

    const index = this.getIndex(r, c);

    const x = c * size;
    const y = r * size;

    const rect = new Path.Rectangle({
      x,
      y,
      width: size,
      height: size
    });

    Paper.project.activeLayer.children[index].addChild(rect);

    return rect;
  }

  initGroups() {
    for(let i = 0; i < this.colours.length; i++){
      const group = new Group();
    }
  }

  renderGroups() {

    for (const group of Paper.project.activeLayer.children){

      group.strokeColor = '#000';
      group.strokeWidth = 2;

      // shadow
      group.shadowColor = '#000';
      group.shadowOffset = 0;
    }
  }

  renderGrid() {

    for(let r = 0; r < this.state.rows; r++){
      for(let c = 0; c < this.state.cols; c++){
        this.addRect(r, c);
      }
    }

    this.renderGroups();

    Paper.view.draw();
  }

  calculateAlpha(flag, delta) {

    const base = 0.4;

    const dirDelta = flag ? delta : this.fps - delta;

    const alpha = base + (1-base) / this.fps * dirDelta;

    return parseFloat(alpha.toFixed(2));
  }

  updateStatus(index: 0, count: 0) {

    const group = Paper.project.activeLayer.children[index];

    const delta = count % this.fps;

    const flag =  Math.floor(count / this.fps) % 2 === 0;

    const bottomReached = delta === 0 && flag && count > 0;

    const sign = (flag) ? 1.0 : -1.0;

    const scaleRatio = 1.0 + sign * index * 0.001;

    group.translate(this.translations[group.index]);

    const c = new Color(this.colours[index]);
    c.alpha = this.calculateAlpha(flag, delta);

    for (const rect of group.children){
      rect.rotate(1);
      rect.scale(scaleRatio);
      rect.fillColor = c;
      rect.shadowBlur += sign / 2;
    }

    return bottomReached;
  }

  initCanvas() {

    Paper.setup(this.state.id);

    this.initGroups();

    let count = 0;
    let change = false;

    let coloursIndex = 0;

    Paper.view.onFrame = (ev) => {

      // set FPS
      //if(ev.count % this.fpsRatio != 0) return;

      change = Paper.project.activeLayer.children.reduce((acc, group, index) => {
        return acc || this.updateStatus(index, count);
      }, false);

      if(change){
        const temp = this.translations.shift();
        this.translations.push(temp);

        (coloursIndex >= this.colourSets.length-1) ? coloursIndex = 0 : coloursIndex++;
        this.colours = this.colourSets[coloursIndex];
      }

      count++;
    };
  }

  render() {
    return (
      <equalizer>
        <canvas id={this.state.id} width={this.state.canvas.width} height={this.state.canvas.height}></canvas>
      </equalizer>
    );
  }
}
