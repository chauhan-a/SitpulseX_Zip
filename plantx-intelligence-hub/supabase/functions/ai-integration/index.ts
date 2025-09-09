import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, question, context, user_api_key, model } = await req.json();

    // Get user's API key if not provided directly
    let apiKey = user_api_key;
    if (!apiKey) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );

      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
        
        if (user) {
          const { data: providerData } = await supabaseClient
            .from('ai_providers')
            .select('api_key, model_name, is_active')
            .eq('user_id', user.id)
            .eq('provider_name', provider)
            .eq('is_active', true)
            .single();

          if (providerData) {
            apiKey = providerData.api_key;
          }
        }
      }
    }

    let response;
    switch (provider) {
      case 'openai':
        response = await queryOpenAI(question, context, apiKey, model);
        break;
      case 'deepseek':
        response = await queryDeepSeek(question, context, apiKey, model);
        break;
      case 'gemini':
        response = await queryGemini(question, context, apiKey, model);
        break;
      case 'llama':
        response = await queryLlama(question, context, apiKey, model);
        break;
      case 'anthropic':
        response = await queryAnthropic(question, context, apiKey, model);
        break;
      case 'huggingface':
        response = await queryHuggingFace(question, context, apiKey, model);
        break;
      default:
        response = await getMockAIResponse(question, context);
    }

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI integration error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function queryOpenAI(question: string, context: string, apiKey?: string, model?: string) {
  const key = apiKey || Deno.env.get('OPENAI_API_KEY');
  
  if (!key) {
    return getMockAIResponse(question, context, 'OpenAI');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an industrial operations assistant helping with field operations, equipment maintenance, and safety procedures. Provide practical, actionable answers.'
        },
        {
          role: 'user',
          content: `Context: ${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`OpenAI API error: ${data.error.message}`);
  }
  return data.choices[0].message.content;
}

async function queryDeepSeek(question: string, context: string, apiKey?: string, model?: string) {
  const key = apiKey || Deno.env.get('DEEPSEEK_API_KEY');
  
  if (!key) {
    return getMockAIResponse(question, context, 'DeepSeek');
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an industrial operations assistant helping with field operations, equipment maintenance, and safety procedures. Provide practical, actionable answers.'
        },
        {
          role: 'user',
          content: `Context: ${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`DeepSeek API error: ${data.error.message}`);
  }
  return data.choices[0].message.content;
}

async function queryGemini(question: string, context: string, apiKey?: string, model?: string) {
  const key = apiKey || Deno.env.get('GEMINI_API_KEY');
  
  if (!key) {
    return getMockAIResponse(question, context, 'Gemini');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Context: ${context}\n\nQuestion: ${question}\n\nYou are an industrial operations assistant helping with field operations, equipment maintenance, and safety procedures. Provide practical, actionable answers.`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`);
  }
  return data.candidates[0].content.parts[0].text;
}

async function queryLlama(question: string, context: string, apiKey?: string, model?: string) {
  const key = apiKey || Deno.env.get('PERPLEXITY_API_KEY');
  
  if (!key) {
    return getMockAIResponse(question, context, 'Llama');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are an industrial operations assistant helping with field operations, equipment maintenance, and safety procedures. Provide practical, actionable answers.'
        },
        {
          role: 'user',
          content: `Context: ${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.2,
      max_tokens: 1000
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Perplexity API error: ${data.error.message}`);
  }
  return data.choices[0].message.content;
}

async function queryAnthropic(question: string, context: string, apiKey?: string, model?: string) {
  const key = apiKey || Deno.env.get('ANTHROPIC_API_KEY');
  
  if (!key) {
    return getMockAIResponse(question, context, 'Claude');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model || 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Context: ${context}\n\nQuestion: ${question}\n\nYou are an industrial operations assistant helping with field operations, equipment maintenance, and safety procedures. Provide practical, actionable answers.`
        }
      ],
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Anthropic API error: ${data.error.message}`);
  }
  return data.content[0].text;
}

async function queryHuggingFace(question: string, context: string, apiKey?: string, model?: string) {
  const key = apiKey || Deno.env.get('HUGGINGFACE_API_KEY');
  
  if (!key) {
    return getMockAIResponse(question, context, 'HuggingFace');
  }

  const response = await fetch(`https://api-inference.huggingface.co/models/${model || 'microsoft/DialoGPT-medium'}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: `Context: ${context}\n\nQuestion: ${question}\n\nYou are an industrial operations assistant helping with field operations, equipment maintenance, and safety procedures. Provide practical, actionable answers.`,
      parameters: {
        max_length: 1000,
        temperature: 0.7
      }
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`HuggingFace API error: ${data.error}`);
  }
  return Array.isArray(data) ? data[0].generated_text : data.generated_text;
}

function getMockAIResponse(question: string, context: string, provider = 'AI Assistant') {
  const responses: { [key: string]: string } = {
    'How do I troubleshoot a pump failure?': `**${provider} Response:**

**Pump Failure Troubleshooting Steps:**

1. **Safety First**
   - Ensure pump is completely shut down
   - Lock out/tag out electrical supply
   - Release system pressure

2. **Initial Visual Inspection**
   - Check for obvious leaks or damage
   - Inspect coupling alignment
   - Verify motor rotation direction

3. **Common Issues & Solutions**
   - **No flow:** Check suction strainer, prime pump
   - **Low pressure:** Inspect impeller for wear/damage
   - **Excessive vibration:** Check shaft alignment, bearing condition
   - **Overheating:** Verify cooling water flow, check bearings

4. **Recommended Actions**
   - Document all findings
   - Replace worn components
   - Perform vibration analysis
   - Schedule follow-up inspection

**Contact maintenance team if issues persist.**`,

    'What are the emergency shutdown procedures?': `**${provider} Response:**

**Emergency Shutdown Procedures:**

**IMMEDIATE ACTIONS:**
1. **Press Emergency Stop** - Red buttons located at each control station
2. **Alert Personnel** - Sound alarm and announce "Emergency Shutdown"
3. **Evacuate Area** - Move to designated safe zone

**SYSTEMATIC SHUTDOWN:**
1. **Stop Production Equipment**
   - Shut down conveyors and processing units
   - Close main supply valves
   - Activate emergency drainage

2. **Isolate Energy Sources**
   - Disconnect electrical supplies
   - Close gas/steam valves
   - Depressurize systems

3. **Ventilation & Safety**
   - Activate emergency ventilation
   - Check gas detection systems
   - Ensure fire suppression ready

**POST-SHUTDOWN:**
- Account for all personnel
- Contact emergency services if needed
- Begin damage assessment
- Document incident

**Only authorized personnel may restart systems after clearance.**`,

    'How to maintain equipment schedules?': `**${provider} Response:**

**Equipment Maintenance Scheduling Best Practices:**

**1. Preventive Maintenance (PM) Schedule**
- **Daily:** Visual inspections, lubrication checks
- **Weekly:** Vibration monitoring, filter changes
- **Monthly:** Detailed inspections, calibrations
- **Quarterly:** Major component servicing
- **Annually:** Complete overhauls, certifications

**2. Condition-Based Maintenance**
- Monitor equipment health in real-time
- Use predictive analytics to schedule repairs
- Track performance trends and degradation

**3. Digital Tools & Tracking**
- Use CMMS (Computerized Maintenance Management System)
- Set automated alerts for due dates
- Track work orders and completion rates
- Maintain equipment history logs

**4. Resource Planning**
- Schedule skilled technicians
- Ensure parts availability
- Coordinate with production schedules
- Plan for equipment downtime

**5. Continuous Improvement**
- Analyze maintenance data
- Adjust schedules based on performance
- Train staff on new procedures
- Update documentation regularly

**Key Success Factors:**
- Standardized procedures
- Clear documentation
- Regular training updates
- Performance monitoring`
  };

  return responses[question] || `**${provider} Response:**

I'd be happy to help with "${question}". 

Based on the context provided: ${context}

Here are some general recommendations:
- Follow established safety procedures
- Consult equipment manuals and documentation
- Contact your supervisor or maintenance team for specific guidance
- Document any issues or observations
- Ensure proper training before performing any procedures

For more detailed assistance, please provide additional context about your specific situation or equipment involved.`;
}