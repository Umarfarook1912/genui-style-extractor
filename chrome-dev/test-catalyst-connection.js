/**
 * GenUI - Catalyst Connection Test
 * Open Chrome DevTools Console and run this to test
 */

async function testCatalystConnection() {
    console.log('🧪 Testing Catalyst Connection...\n');

    // Test styles
    const testStyles = {
        width: '300px',
        height: '200px',
        backgroundColor: 'rgb(59, 130, 246)',
        color: 'rgb(255, 255, 255)',
        fontSize: '16px',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    console.log('📤 Sending test styles:', testStyles);

    try {
        // Test CSS conversion
        console.log('\n🎨 Testing CSS conversion...');
        const cssResult = await catalystService.convertStyles(testStyles, 'css', true);
        console.log('✅ CSS Result:', cssResult);

        // Test Tailwind conversion
        console.log('\n🎨 Testing Tailwind conversion...');
        const tailwindResult = await catalystService.convertStyles(testStyles, 'tailwind', false);
        console.log('✅ Tailwind Result:', tailwindResult);

        // Test JSX conversion
        console.log('\n🎨 Testing JSX conversion...');
        const jsxResult = await catalystService.convertStyles(testStyles, 'jsx', false);
        console.log('✅ JSX Result:', jsxResult);

        console.log('\n✅ All tests passed! Catalyst is working correctly.');
        return true;

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Check if Catalyst function is deployed: catalyst function:list');
        console.log('2. Verify function URL in config.js');
        console.log('3. Test locally: catalyst serve (then use http://localhost:9000/...)');
        return false;
    }
}

// Auto-run if in console
if (typeof window !== 'undefined') {
    console.log('💡 To test Catalyst connection, run: testCatalystConnection()');
}
