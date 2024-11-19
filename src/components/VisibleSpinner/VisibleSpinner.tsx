import { Spinner } from "@telegram-apps/telegram-ui"

export const VisibleSpinner = ({ isVisible = true, containerType }: { isVisible?: boolean, containerType: "center" | "flex" }) => {
    if(isVisible)
    {
        if(containerType == "center") {
            return (
                <div className="spinner-container-fixed-center">
                    <Spinner size="l" />
                </div>
            )
        }

        if(containerType == "flex") {
            return (
                <div className="spinner-container-flex">
                    <Spinner size="l" />
                </div>
            )
        }
    }
}