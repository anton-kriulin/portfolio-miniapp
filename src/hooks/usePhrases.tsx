import { Config } from "@/lib/Config"
import { PhraseDto } from "@/lib/Types"
export const usePhrases = (language?: string) => {
    const phrases: PhraseDto = {};
    const locale: string = language ? language : "en";

    for(const item in Config.phrases) {
        phrases[item] = Config.phrases[item][locale]
    }
    
    return {phrases};
}