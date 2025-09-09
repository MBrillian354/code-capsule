declare module 'unfluff' {
  const unfluff: (html: string) => { title?: string; text: string }
  export default unfluff
}
