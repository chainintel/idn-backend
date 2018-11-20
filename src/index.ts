const { fromBuffer, toBuffer } = require('@idn/util-buffer');

class Runner {
  _model;
  _runner;
  _initFn;
  _inferFn;
  _destroyFn;
  constructor(_model, _initFn, _inferFn, _destroyFn: any = undefined) {
    this._model = _model;
    this._initFn = _initFn;
    this._inferFn = _inferFn;
    this._destroyFn = _destroyFn;
  }
  async init() {
    this._runner = await this._initFn(this._model);
  }
  async infer(inputs) {
    inputs = inputs.map((i) => fromBuffer(i));
    let results = await this._inferFn(this._runner, inputs);
    let outputs: Array<Buffer> = results.map((o) => toBuffer(o));
    return outputs;
  }
  async destroy() {
    if (this._destroyFn) {
      await this._destroyFn(this._runner, this._model);
    }
  }
}

class Backend {
  _types;
  constructor(_types) {
    this._types = _types;
  }
  get types() {
    return this._types || [];
  }
  async _initFn(model): Promise<any> {
    throw '_initFn Not Implemented';
  }
  async _inferFn(runner, inputs): Promise<any> {
    throw '_inferFn Not Implemented';
  }
  async _destroyFn(runner, model): Promise<any> {}
  async init(model): Promise<Runner> {
    let runner = new Runner(
      model,
      this._initFn.bind(this),
      this._inferFn.bind(this),
      this._destroyFn.bind(this)
    );
    await runner.init();
    return runner;
  }
}

export { Backend, Runner };
