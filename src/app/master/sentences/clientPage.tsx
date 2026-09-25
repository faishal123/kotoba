"use client";

import { FetchFunctionType } from "@/app/upload/clientPage";
import { TableHeader } from "@/components/Atoms/Table/Table";
import {
  SingleSentenceDialog,
  SingleSentenceRow,
} from "@/components/Molecules/Upload/Sentences/single";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetSentences } from "@/services/get-sentences/useGetSentences";

export const SentenceClientPage = () => {
  const {
    data: sentences,
    isPending,
    refetch: refetchSentence,
  } = useGetSentences();

  const refetch: FetchFunctionType = async () => {
    refetchSentence();
  };

  return (
    <div className="p-5">
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <h1 className="text-xl font-bold">Sentences List</h1>
          <div className="p-5">
            <div className="pb-3">
              <SingleSentenceDialog
                type="create"
                refetchData={refetch}
                trigger={<Button>Create Sentence</Button>}
              />
            </div>
            {!(sentences || []).length ? (
              <div>No sentences registered</div>
            ) : (
              <table>
                <tbody>
                  <tr>
                    <TableHeader>Sentence</TableHeader>
                    <TableHeader>English</TableHeader>
                    <TableHeader></TableHeader>
                  </tr>
                  {sentences?.map((sentence) => (
                    <SingleSentenceRow
                      refetchData={refetch}
                      sentence={sentence}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};
