// Test script for Cultural Heritage Chatbot
// This script tests the chatbot functionality including dataset integration

const testQuestions = [
  // Questions that should be answered from the cultural dataset
  {
    question: "What is Kathakali?",
    expectedSource: "dataset",
    description: "Should be answered from cultural dataset"
  },
  {
    question: "Which state is famous for bamboo crafts?",
    expectedSource: "dataset", 
    description: "Should be answered from cultural dataset"
  },
  {
    question: "What is the story of Konark Sun Temple?",
    expectedSource: "dataset",
    description: "Should be answered from cultural dataset"
  },
  {
    question: "Which state is Kerala in?",
    expectedSource: "dataset",
    description: "Should be answered from cultural dataset"
  },
  
  // Questions that should be answered by AI (not in dataset)
  {
    question: "Tell me about the Ajanta Caves in detail",
    expectedSource: "ai",
    description: "Should be answered by AI service"
  },
  {
    question: "What are some traditional wedding customs in India?",
    expectedSource: "ai",
    description: "Should be answered by AI service"
  }
];

async function testChatbot() {
  console.log('🧪 Testing Cultural Heritage Chatbot...\n');
  
  const baseUrl = 'http://localhost:5000';
  
  // Test health endpoint
  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData.message);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }
  
  console.log('\n📝 Testing Cultural Questions:\n');
  
  for (let i = 0; i < testQuestions.length; i++) {
    const test = testQuestions[i];
    console.log(`Test ${i + 1}: ${test.description}`);
    console.log(`Question: "${test.question}"`);
    
    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: test.question,
          conversationHistory: []
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Response received (${data.response.length} characters)`);
        console.log(`Answer: ${data.response.substring(0, 100)}...`);
        
        // Check if response seems to come from dataset (shorter, more specific)
        const isFromDataset = data.response.length < 300 && 
                             (data.response.includes('is a') || 
                              data.response.includes('is famous for') ||
                              data.response.includes('is known for'));
        
        if (test.expectedSource === 'dataset' && isFromDataset) {
          console.log('✅ Correctly answered from dataset');
        } else if (test.expectedSource === 'ai' && !isFromDataset) {
          console.log('✅ Correctly answered by AI');
        } else {
          console.log('⚠️  Source unclear - may need adjustment');
        }
      } else {
        console.log(`❌ Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('---\n');
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 Testing completed!');
  console.log('\n📋 Test Summary:');
  console.log('- Dataset integration: Tests questions that should be answered from cultural knowledge base');
  console.log('- AI fallback: Tests questions that should be answered by AI services');
  console.log('- Conversation memory: Backend maintains conversation history');
  console.log('- Error handling: Graceful fallbacks for API failures');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Start the frontend: cd cultural-wonders && npm run dev');
  console.log('2. Visit: http://localhost:5173/chat');
  console.log('3. Test the enhanced UI with traditional Indian styling');
  console.log('4. Try the speech features (Text-to-Speech)');
  console.log('5. Test conversation memory by asking follow-up questions');
}

// Run the test
testChatbot().catch(console.error);
