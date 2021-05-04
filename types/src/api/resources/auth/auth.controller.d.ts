export declare const authCheck: (req: any, res: any, next: any) => void;
/**
 * @param {object} req - request object
 * @param {number} role - role value
 * @return {boolean} - It will return true if user is authenticated and authorized otherwise it will return false
 */
export declare const authCheckGraph: (req: any, role: any) => Promise<boolean | undefined>;
