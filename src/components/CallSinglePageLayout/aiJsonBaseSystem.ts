import type {AiJsonList} from '../../stores/types/callsStoreTypes';

const BASE_SYSTEM_NAME = 'БАЗОВЫЙ СИСТЕМНЫЙ';

const OLD_PROBLEM_KEY = 'требует_звонок_незамедлительного_внимания (проблемный звонок)';
const NEW_PROBLEM_KEY = 'требует_звонок_незамедлительного_внимания_(проблемный_звонок)';

function normalizeAiRoots(input: unknown): AiJsonList[] {
    if (input == null) return [];
    if (Array.isArray(input)) return input as AiJsonList[];
    return [input as AiJsonList];
}

/** Первый корневой объект ответа (id, answers, call_id, org_id, …) */
export function getAiJsonRoot(aiJsonList: unknown): AiJsonList | undefined {
    return normalizeAiRoots(aiJsonList)[0];
}

/** Записи system с именем «БАЗОВЫЙ СИСТЕМНЫЙ» */
export function getBaseSystemEntries(aiJsonList: unknown) {
    const root = getAiJsonRoot(aiJsonList);
    const system = root?.answers?.system;
    if (!Array.isArray(system)) return [];
    return system.filter((item) => item?.name === BASE_SYSTEM_NAME);
}

/** `result` первого базового системного ответа — дальше читаем блоки рекомендаций, клиента и т.д. */
export function getBaseSystemResult(
    aiJsonList: unknown,
): Record<string, unknown> | undefined {
    const r = getBaseSystemEntries(aiJsonList)[0]?.result;
    return r && typeof r === 'object' ? (r as Record<string, unknown>) : undefined;
}

export type RecommendationRow = {действие: string; приоритет: string};

/** Новая структура: маркетинг_действие / маркетинг_приоритет и т.п. */
export function getRecommendationsForSelect(
    result: Record<string, unknown> | undefined,
): Record<string, RecommendationRow> | undefined {
    const block = result?.рекомендации;
    if (!block || typeof block !== 'object') return undefined;
    const out: Record<string, RecommendationRow> = {};
    for (const [catKey, catVal] of Object.entries(block as Record<string, unknown>)) {
        if (!catVal || typeof catVal !== 'object') continue;
        const pairs = Object.entries(catVal as Record<string, string>);
        const действие = pairs.find(([k]) => k.endsWith('_действие'))?.[1] ?? '';
        const приоритет = pairs.find(([k]) => k.endsWith('_приоритет'))?.[1] ?? '';
        out[catKey] = {действие, приоритет};
    }
    return Object.keys(out).length ? out : undefined;
}

function str(v: unknown): string | undefined {
    if (v === null || v === undefined) return undefined;
    const s = String(v);
    return s.length ? s : undefined;
}

export type FlatClientData = {
    имя?: string;
    пол?: string;
    возраст?: string;
    должность?: string;
    место_работы?: string;
    наличие_детей?: string;
    где_живет_клиент?: string;
    хобби_и_интересы?: string;
    семейное_положение?: string;
    сфера_деятельности?: string;
    причина_оценки_возраста?: string;
    информация_о_близких?: {
        имя?: string;
        возраст?: string;
        место_работы?: string;
        степень_родства?: string;
    };
};

/**
 * Плоские поля клиента: верхний уровень + hidden.данные_о_клиенте + hidden.информация_о_близких
 * (совместимо со старым форматом без hidden).
 */
export function flattenClientData(
    result: Record<string, unknown> | undefined,
): FlatClientData {
    const dc = result?.данные_о_клиенте as Record<string, unknown> | undefined;
    if (!dc || typeof dc !== 'object') return {};

    const hidden = dc.hidden as Record<string, Record<string, string>> | undefined;
    const hiddenClient = hidden?.['данные_о_клиенте'];
    const hiddenRel = hidden?.['информация_о_близких'];
    const oldRel = dc.информация_о_близких as Record<string, string> | undefined;

    return {
        имя: str(dc.имя),
        пол: str(dc.пол),
        возраст: str(dc.возраст),
        должность: str(dc.должность ?? hiddenClient?.должность),
        место_работы: str(dc.место_работы ?? hiddenClient?.место_работы),
        наличие_детей: str(dc.наличие_детей),
        где_живет_клиент: str(dc.где_живет_клиент),
        хобби_и_интересы: str(dc.хобби_и_интересы),
        семейное_положение: str(dc.семейное_положение),
        сфера_деятельности: str(dc.сфера_деятельности),
        причина_оценки_возраста: str(dc.причина_оценки_возраста),
        информация_о_близких: {
            имя: str(oldRel?.имя ?? hiddenRel?.информация_о_близких_имя),
            возраст: str(oldRel?.возраст ?? hiddenRel?.информация_о_близких_возраст),
            место_работы: str(
                oldRel?.место_работы ?? hiddenRel?.информация_о_близких_место_работы,
            ),
            степень_родства: str(
                oldRel?.степень_родства ?? hiddenRel?.информация_о_близких_степень_родства,
            ),
        },
    };
}

export type SatisfactionView = {
    initialBall: string;
    initialReason: string;
    finalBall: string;
    finalReason: string;
    comparison: string;
    recommendations: string[];
};

/** Старые ключи балл/причина и новые длинные имена полей */
export function getSatisfactionView(
    result: Record<string, unknown> | undefined,
): SatisfactionView | null {
    const sat = result?.удовлетворенность_клиента;
    if (!sat || typeof sat !== 'object') return null;
    const s = sat as Record<string, unknown>;

    const init = s.начальная_оценка as Record<string, string> | undefined;
    const fin = s.окончательная_оценка as Record<string, string> | undefined;

    const initialBall =
        init?.балл ?? init?.['удовлетворенность_клиента_начальная_оценка'] ?? '';
    const initialReason =
        init?.причина ?? init?.['удовлетворенность_клиента_начальная_оценка_причина'] ?? '';

    const finalBall =
        fin?.балл ?? fin?.['удовлетворенность_клиента_окончательная_оценка'] ?? '';
    const finalReason =
        fin?.причина ?? fin?.['удовлетворенность_клиента_окончательная_оценка_причина'] ?? '';

    const recsRaw = s.рекомендации ?? s.удовлетворенность_клиента_рекомендации;
    const recommendations = Array.isArray(recsRaw) ? recsRaw.map((x) => String(x)) : [];

    return {
        initialBall,
        initialReason,
        finalBall,
        finalReason,
        comparison: str(s.сравнение_удовлетворенности) ?? '',
        recommendations,
    };
}

export function getCallInfoBlock(
    result: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
    const v = result?.['информация_по_звонку'];
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : undefined;
}

export function getManagerInfoBlock(
    result: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
    const v = result?.['информация_по_менеджеру'];
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : undefined;
}

export function getProblematicCallInfo(
    result: Record<string, unknown> | undefined,
): {да_или_нет: string; объяснение: string} {
    const call = getCallInfoBlock(result);
    if (!call) return {да_или_нет: '', объяснение: ''};

    const block = (call[NEW_PROBLEM_KEY] ?? call[OLD_PROBLEM_KEY]) as
        | Record<string, string>
        | undefined;
    if (!block) return {да_или_нет: '', объяснение: ''};

    const да_или_нет =
        block.да_или_нет ?? block.проблемный_звонок_да_или_нет ?? '';
    const объяснение =
        block.объяснение ?? block.проблемный_звонок_объяснение ?? '';

    return {да_или_нет, объяснение};
}
