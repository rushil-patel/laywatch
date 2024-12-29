import type { LoaderFunctionArgs } from "@remix-run/node"
import { task } from "~/tasks/pull-layoff-updates"


export async function loader({ request }: LoaderFunctionArgs) {
    // todo: validate request for secret key
    try {
        task()
        return {
            ok: true
        }
    } catch (error) {
        return {
            ok: false
        }
    }
}