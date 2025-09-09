export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    return <div>Learn Capsule by Id Page: {id}</div>;
}
