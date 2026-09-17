import { describe, it, expect } from 'vitest';
import { coerceBedrockText } from './bedrock-client';

describe('coerceBedrockText', () => {
  it('passes strings through', () => {
    expect(coerceBedrockText('hello')).toBe('hello');
  });

  it('handles nullish and primitives', () => {
    expect(coerceBedrockText(null)).toBe('');
    expect(coerceBedrockText(undefined)).toBe('');
    expect(coerceBedrockText(42)).toBe('42');
    expect(coerceBedrockText(true)).toBe('true');
  });

  it('extracts Titan results outputText', () => {
    expect(coerceBedrockText({ results: [{ outputText: 'titan says hi' }] })).toBe('titan says hi');
  });

  it('extracts Claude content blocks', () => {
    expect(
      coerceBedrockText({ content: [{ type: 'text', text: 'claude ' }, { type: 'text', text: 'says hi' }] })
    ).toBe('claude says hi');
  });

  it('extracts legacy outputText / completion / response / body fields', () => {
    expect(coerceBedrockText({ outputText: 'a' })).toBe('a');
    expect(coerceBedrockText({ completion: 'b' })).toBe('b');
    expect(coerceBedrockText({ response: 'c' })).toBe('c');
    expect(coerceBedrockText({ body: 'd' })).toBe('d');
  });

  it('falls back to JSON for unknown shapes', () => {
    expect(coerceBedrockText({ weird: [1, 2] })).toBe('{"weird":[1,2]}');
  });
});
