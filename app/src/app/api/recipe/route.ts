import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getStage, getTexture, checkSafety } from '@/lib/safetyData';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { ingredients, ageMonths, allergies = [], isRandom = false } = await req.json();

    // 안전 경고 체크
    const warnings = checkSafety(isRandom ? [] : ingredients, ageMonths);
    const stage = getStage(ageMonths);
    const texture = getTexture(ageMonths);

    const forbiddenList = [...allergies, ...warnings.map((w: { ingredient: string }) => w.ingredient)].join(', ');
    const ingredientText = isRandom
      ? '제철 재료 중 적합한 것으로 자유롭게 선택'
      : ingredients.join(', ');

    const prompt = `당신은 유아 영양 전문가입니다. 아래 조건에 맞는 이유식/유아식 레시피 1개를 만들어주세요.

아이 정보:
- 개월수: ${ageMonths}개월
- 이유식 단계: ${stage}
- 식감 기준: ${texture}
${forbiddenList ? `- 금지/제외 재료: ${forbiddenList}` : ''}

사용할 재료: ${ingredientText}

응답은 반드시 아래 JSON 형식으로만 해주세요:
{
  "title": "레시피 이름",
  "ingredients": ["재료1 양", "재료2 양"],
  "steps": ["조리 단계1", "조리 단계2", "조리 단계3"],
  "nutritionNote": "영양 포인트 한 줄",
  "coupangKeyword": "쿠팡 검색용 핵심 재료명"
}`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // JSON 파싱
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON not found in response');
    const recipe = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      recipe,
      warnings,
      stage,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '레시피 생성에 실패했습니다.' }, { status: 500 });
  }
}
