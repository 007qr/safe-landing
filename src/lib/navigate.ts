export const navigateUtil = {
    navigateTo: (url: string, { replace = false }) => {
        if (typeof window !== 'undefined') {
            if (replace) {
                window.history.replaceState({}, '', url)
            } else {
                window.history.pushState({}, '', url)
            }
        }
    },

    reloadPage: () => {
        if (typeof window !== 'undefined') {
            window.location.reload()
        }
    },
}
