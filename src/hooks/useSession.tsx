import { useState, useEffect, useContext } from "react"
import { usePhrases } from "@/hooks"
import { GlobalContext } from "@/lib/Context";
import { ISession } from "@/lib/Types";

export const useSession = () => {

    const session: ISession | undefined = useContext(GlobalContext)
    const [accessToken, setAccessToken] = useState<string>();
    const [language, setLanguage] = useState<string>();
    const [telegramId, setTelegramId] = useState<number>();
    const {phrases} = usePhrases(language);
    const [mainScreen, setMainScreen] = useState<string>();
    const [dataType, setDataType] = useState<string>();
    
    useEffect(() => {
        if(!session) { return }
        setAccessToken(session.accessToken)
        setLanguage(session.language)
        setTelegramId(session.telegramId)
        setMainScreen(session.mainScreen)
        setDataType(session.dataType)
    }, [session]);

    return {
        accessToken, 
        phrases, 
        telegramId, 
        language, 
        session, 
        mainScreen, 
        dataType,
        setLanguage: session?.setLanguage,
        setDataType: session?.setDataType
    }
}