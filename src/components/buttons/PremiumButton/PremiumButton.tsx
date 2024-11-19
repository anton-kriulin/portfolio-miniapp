'use client'
import { useSession } from "@/hooks"
import { Button } from "@telegram-apps/telegram-ui"
import './styles.css'

export const PremiumButton = () => {
    const {phrases} = useSession();

    return (
        <Button className="premium-button">{phrases.premium}</Button>
    )
}