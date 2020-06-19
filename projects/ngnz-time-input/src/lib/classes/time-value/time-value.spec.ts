import { TimeInputMode } from '../../datatypes/time-input-mode.enum';
import { TimeValue } from './time-value';

describe('NgnzTimeValue', () => {
    it('should create an instance', () => {
        expect(
            new TimeValue(TimeInputMode.CircularForwarding)
        ).toBeTruthy();
    });
});
