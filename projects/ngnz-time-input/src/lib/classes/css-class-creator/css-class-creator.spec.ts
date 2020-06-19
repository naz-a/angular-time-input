import { CssClassCreator } from './css-class-creator';

describe('CssClassCreator', () => {
    it('should create an instance', () => {
        expect(new CssClassCreator()).toBeTruthy();
    });

    it('append class as a space separated string', () => {
        const cls = new CssClassCreator('a1 a2').generate();
        console.log("new CssClassCreator('a1 a2').generate(): ", cls);
        expect(cls['a1']).toBeTrue();
        expect(cls['a2']).toBeTrue();
    });
    it('append class as a comma separated string', () => {
        const cls = new CssClassCreator('a1, a2').generate();
        console.log("new CssClassCreator('a1, a2').generate(): ", cls);
        expect(cls['a1']).toBeTrue();
        expect(cls['a2']).toBeTrue();
    });
    it('append class as a semicolon separated string', () => {
        const cls = new CssClassCreator('a1,, a2').generate();
        console.log("new CssClassCreator('a1,, a2').generate(): ", cls);
        expect(cls['a1']).toBeTrue();
        expect(cls['a2']).toBeTrue();
    });
    it('append class as a tab separated string', () => {
        const cls = new CssClassCreator('a1 a2').generate();
        console.log("new CssClassCreator('a1<TAB>a2').generate(): ", cls);
        expect(cls['a1']).toBeTrue();
        expect(cls['a2']).toBeTrue();
    });
    it('append class as an array of string', () => {
        const cls = new CssClassCreator(['a1', 'a2']).generate();
        console.log("new CssClassCreator(['a1', 'a2']).generate(): ", cls);
        expect(cls['a1']).toBeTrue();
        expect(cls['a2']).toBeTrue();
    });
    it('append class as an instance of CssClass', () => {
        const cls = new CssClassCreator({ a1: true, a2: true }).generate();
        console.log(
            'new CssClassCreator({ a1: true, a2: true }).generate(): ',
            cls
        );
        expect(cls['a1']).toBeTrue();
        expect(cls['a2']).toBeTrue();
    });
    it('append class as an instance of CssClass with function trigger', () => {
        const cls = new CssClassCreator({
            a1: () => true,
            a2: () => false,
        }).generate();
        console.log(
            'new CssClassCreator({ a1: ()=>true, a2: ()=>false }).generate(): ',
            cls
        );
        expect(cls['a1']).toBeTrue();
        expect(cls['a2']).toBeFalse();
    });
});
