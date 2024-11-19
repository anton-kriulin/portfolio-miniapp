import { stylesToCss } from '@/lib/Utils';

export const styles: string = stylesToCss({
    mockDataControl: {
        width: "100%",
        height: 48,
        position: "sticky",
        padding: 0,
        backgroundColor: "var(--portfolio-primary-green)",
    },
    mockDataControlRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        padding: 6,
    },
    mockDataControlButton: {
        width: "20%",
        backgroundColor: "var(--tg-theme-secondary-bg-color)"
    }
})