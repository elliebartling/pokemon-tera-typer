import voca from "voca"

export function capitalize(text) {
    return voca(text).replaceAll('-', ' ').titleCase()
}