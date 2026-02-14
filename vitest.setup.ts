import 'fake-indexeddb/auto';

// Create a realistic localStorage mock if needed, but jsdom usually has one.
// If we need to clear it between tests, we can use beforeEach in the tests or here.
// For now, let's trust jsdom's localStorage but make sure we can spy on it if needed.
