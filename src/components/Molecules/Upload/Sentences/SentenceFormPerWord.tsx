import { FormInput } from "@/components/Atoms/Form/FormInput";
import { Button } from "@/components/ui/button";
import { closeOpenedDialog } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateSentence } from "@/services/create-sentence/useCreateSentence";
import { useEditSentence } from "@/services/edit-sentence/useEditSentence";
import { SentenceInputRenderer } from "@/utils/sentenceRenderer";
import { createStringZodSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SingleSentenceDialogPropTypes } from "./type";
import { capitalizeFirstLetter } from "@/utils/common";
import { SentenceJSON } from "@/models/sentence";
import { toast } from "react-toastify";

const formSchema = z.object({
  sentence_json: createStringZodSchema({ required: true, json: true }),
  english: createStringZodSchema({ required: true }),
});

type FormType = z.infer<typeof formSchema>;

export const SentencePerWordForm = ({
  type,
  defaultValues,
  refetchData,
}: SingleSentenceDialogPropTypes) => {
  const isEdit = type === "edit";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      english: defaultValues?.english || "",
      sentence_json: "[]",
    },
  });

  const submitFunction = async (data: FormType) => {
    let sentenceJson: SentenceJSON = [];
    try {
      sentenceJson = JSON.parse(data?.sentence_json);
    } catch {
      toast("Please enter valid JSON", { type: "error" });
      return;
    }
    const sentenceJapanese = sentenceJson?.reduce((a, c) => {
      return `${a}${c?.japanese || ""}`;
    }, "");
    if (!data.english || sentenceJson.length <= 0 || !sentenceJapanese) {
      toast("All fields are required", { type: "error" });
      return;
    }
    if (isEdit) {
      await editSentence({
        id: defaultValues?.id || "",
        english: data?.english,
        sentence_json: sentenceJson,
        sentence: sentenceJapanese,
      });
    } else {
      await createSentence({
        english: data?.english,
        sentence_json: sentenceJson,
        sentence: sentenceJapanese,
      });
    }
    form.reset();

    await refetchData?.();
  };

  const { mutateAsync: editSentence, isPending: editSentencePending } =
    useEditSentence({
      onError: (e) => {
        toast(e.message, { type: "error" });
      },
      onSuccess: () => {
        closeOpenedDialog();
        toast("Particle updated successfully", { type: "success" });
      },
    });

  const { mutateAsync: createSentence, isPending: createSentencePending } =
    useCreateSentence({
      onError: (e) => {
        toast(e.message, { type: "error" });
      },
      onSuccess: () => {
        closeOpenedDialog();
        toast("Particle created successfully", { type: "success" });
      },
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitFunction)}
        className="space-y-4 max-h-[80vh] overflow-auto"
      >
        <FormInput
          label="English"
          name="english"
          control={form.control}
          placeholder="English"
          disabled={editSentencePending || createSentencePending}
        />
        <SentenceInputRenderer
          control={form.control}
          name="sentence_json"
          defaultSentence={defaultValues?.sentence_json}
          setValue={(value) => {
            form.setValue("sentence_json", value);
          }}
        />
        <Button
          isLoading={editSentencePending || createSentencePending}
          type="submit"
        >
          {capitalizeFirstLetter(type)}
        </Button>
      </form>
    </Form>
  );
};
