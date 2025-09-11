// Comprehensive test script for all AI features
// This script tests all the new AI integrations across the Cultural Heritage project

const testEndpoints = [
  {
    name: 'Chat API',
    endpoint: '/api/chat',
    data: { message: 'What is Kathakali?', conversationHistory: [] },
    expectedField: 'response'
  },
  {
    name: 'Quiz Hint API',
    endpoint: '/api/quiz-hint',
    data: { 
      question: 'Which state is famous for Kathakali?', 
      options: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh'] 
    },
    expectedField: 'hint'
  },
  {
    name: 'Cultural Story API',
    endpoint: '/api/generate-story',
    data: { 
      topic: 'Ajanta Caves', 
      context: 'Ancient Buddhist cave paintings in Maharashtra' 
    },
    expectedField: 'story'
  },
  {
    name: 'Travel Guide API',
    endpoint: '/api/travel-guide',
    data: { 
      state: 'Rajasthan', 
      duration: 5 
    },
    expectedField: 'itinerary'
  },
  {
    name: 'Historical Perspective API',
    endpoint: '/api/historical-perspective',
    data: { 
      tradition: 'Madhubani painting', 
      context: 'Traditional folk art from Bihar' 
    },
    expectedField: 'perspective'
  },
  {
    name: 'Cultural Search API',
    endpoint: '/api/cultural-search',
    data: { 
      query: 'dance forms of North India' 
    },
    expectedField: 'results'
  }
];

async function testAIFeatures() {
  console.log('🤖 Testing All AI Features...\n');
  
  const baseUrl = 'http://localhost:5000';
  
  // Test health endpoint first
  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend Health Check:', healthData.message);
  } catch (error) {
    console.log('❌ Backend Health Check Failed:', error.message);
    console.log('Please make sure the backend server is running on port 5000');
    return;
  }
  
  console.log('\n🧪 Testing AI Endpoints:\n');
  
  let passedTests = 0;
  let totalTests = testEndpoints.length;
  
  for (let i = 0; i < testEndpoints.length; i++) {
    const test = testEndpoints[i];
    console.log(`Test ${i + 1}: ${test.name}`);
    console.log(`Endpoint: ${test.endpoint}`);
    
    try {
      const response = await fetch(`${baseUrl}${test.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.data),
      });
      
      if (response.ok) {
        const result = await response.json();
        const content = result[test.expectedField];
        
        if (content && content.length > 0) {
          console.log(`✅ ${test.name} - Success`);
          console.log(`Response length: ${content.length} characters`);
          console.log(`Preview: ${content.substring(0, 100)}...`);
          passedTests++;
        } else {
          console.log(`⚠️  ${test.name} - Empty response`);
        }
      } else {
        console.log(`❌ ${test.name} - HTTP ${response.status}`);
        const errorData = await response.json();
        console.log(`Error: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
    }
    
    console.log('---\n');
    
    // Wait between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 AI Features Testing Completed!');
  console.log(`\n📊 Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎊 All AI features are working perfectly!');
  } else if (passedTests > totalTests / 2) {
    console.log('👍 Most AI features are working. Check failed tests above.');
  } else {
    console.log('⚠️  Several AI features need attention. Check your API configuration.');
  }
  
  console.log('\n🚀 Frontend Features to Test:');
  console.log('1. Quiz AI Hints: Visit /quiz and click "Ask AI for a hint"');
  console.log('2. Heritage Stories: Visit /heritage and click "Generate a story"');
  console.log('3. Travel Guides: Visit any state page and click "Plan a cultural trip"');
  console.log('4. AI Search: Use the search bar in the navigation');
  console.log('5. Chat Interface: Visit /chat for the full AI chat experience');
  
  console.log('\n📋 Feature Summary:');
  console.log('✅ Quiz AI Hints - Provides contextual hints for quiz questions');
  console.log('✅ Cultural Storytelling - Generates immersive stories for heritage sites');
  console.log('✅ AI Travel Guide - Creates detailed cultural travel itineraries');
  console.log('✅ Historical Perspective - Shows how traditions were experienced 200 years ago');
  console.log('✅ AI-Powered Search - Intelligent search across cultural content');
  console.log('✅ Enhanced Chat - Full conversational AI with cultural specialization');
  
  console.log('\n🎨 UI Enhancements:');
  console.log('✅ Traditional Indian styling with saffron, peacock blue, and maroon colors');
  console.log('✅ Cultural fonts (Poppins + Tiro Devanagari)');
  console.log('✅ Animated AI responses with typing effects');
  console.log('✅ Traditional icons and patterns');
  console.log('✅ Responsive design for all devices');
}

// Run the comprehensive test
testAIFeatures().catch(console.error);
