import { expect, test } from 'vitest';
import { getMeasureLengthMS, numMeasures } from './ChartParser';

test('Get Measure Length', () => {
	expect(getMeasureLengthMS(60000)).toBe(4000);
	expect(getMeasureLengthMS(120000)).toBe(2000);
	expect(getMeasureLengthMS(180000)).toBe(1333 + 1 / 3); // 1333.33333333
});

test('Get Number of Measures', () => {
	expect(numMeasures(192, 192)).toBe(0.25);
	expect(numMeasures(768, 192)).toBe(1);
	expect(numMeasures(1152, 192)).toBe(1.5);
});
