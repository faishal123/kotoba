export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const quizzesParam = (await searchParams).quizzes as string | undefined;
  const quizzes = quizzesParam ? quizzesParam.split(",") : [];

  console.log(quizzes);

  return <div>test</div>;
}
