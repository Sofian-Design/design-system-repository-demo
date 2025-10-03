import '@testing-library/jest-dom/vitest';
import 'reflect-metadata';
import 'zone.js';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

beforeAll(() => {
  const testBed = getTestBed();
  testBed.resetTestEnvironment();
  testBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
});
