export class JsUtils {
    /**
     * Creates a copy of the given JSON object
     *
     * @param objToCopy The object to copy
     * @returns A copy of that object
     */
    public static createCopy<T = any>(objToCopy: T): T {
        return objToCopy !== undefined ? JSON.parse(JSON.stringify(objToCopy)) : undefined;
    }
}
