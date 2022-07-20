export const hexToString = (s: string) => {
    // return decodeURIComponent(
    //     s.replace(/\s+/g, '') // remove spaces
    //         .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
    // );
    return Buffer.from(s, 'hex').toString('utf8')

}