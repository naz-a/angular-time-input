import { BooleanFunction } from '../../datatypes/boolean-function';
import { BooleanTrigger } from '../../datatypes/boolean-trigger';
import { CssClasses } from '../../datatypes/css-classes';
import { CssClassesDefinition } from '../../datatypes/css-classes-definition';

export class CssClassCreator {
    protected _classes: CssClasses = {};
    constructor(initVal?: CssClassesDefinition) {
        if (!!initVal) {
            this.appendCssClasses(initVal);
        }
    }

    appendCssClasses(
        classes: CssClassesDefinition,
        trigger: BooleanTrigger = true
    ) {
        if (!!classes) {
            if (typeof classes === 'string') {
                this._createFromString(classes, trigger);
            } else if (Array.isArray(classes)) {
                this._createFromArray(classes, trigger);
            } else if (typeof classes === 'object') {
                Object.assign(this._classes, classes);
            }
        }
        return this;
    }

    generate() {
        const out: CssClasses = {};
        for (const item in this._classes) {
            if (this._classes.hasOwnProperty(item)) {
                out[item] =
                    typeof this._classes[item] === 'function'
                        ? (this._classes[item] as BooleanFunction).call(this)
                        : !!this._classes[item];
            }
        }
        return out;
    }
    protected _createFromArray(classes: string[], trigger: BooleanTrigger) {
        for (const cls of classes) {
            this._classes['' + cls] = true;
        }
    }
    protected _createFromString(classes: string, trigger: BooleanTrigger) {
        const splitted = classes.split(/[\s,;]+/).filter((item) => !!item);
        this._createFromArray(splitted, trigger);
    }
}
