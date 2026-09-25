"use client";

import { FetchFunctionType } from "@/app/upload/clientPage";
import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import { FormInput } from "@/components/Atoms/Form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateParticle } from "@/services/create-particle/useCreateParticle";
import { useEditParticle } from "@/services/edit-particle/useEditParticle";
import { ParticleToEditType, SupabaseParticleType } from "@/utils/supabase";
import { createStringZodSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { closeOpenedDialog } from "@/components/ui/dialog";
import { TableCell } from "@/components/Atoms/Table/Table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteParticle } from "@/services/delete-particle/useDeleteParticle";

const formSchema = z.object({
  japanese: createStringZodSchema({ required: true }),
  romaji: createStringZodSchema({ required: true }),
  english: createStringZodSchema(),
});

type FormType = z.infer<typeof formSchema>;

type SingleParticleDialogPropTypes =
  | {
      type: "edit";
      trigger?: ReactNode;
      defaultValues: ParticleToEditType;
      refetchData: FetchFunctionType;
    }
  | {
      type: "create";
      trigger?: ReactNode;
      defaultValues?: undefined;
      refetchData: FetchFunctionType;
    };

export const SingleParticleDialog = ({
  type,
  trigger,
  defaultValues,
  refetchData,
}: SingleParticleDialogPropTypes) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isEdit = type === "edit";

  const { mutateAsync: editParticle, isPending: editParticlePending } =
    useEditParticle({
      onError: (e) => toast(e.message, { type: "error" }),
      onSuccess: () =>
        toast("Particle updated successfully", { type: "success" }),
    });

  const { mutateAsync: createParticle, isPending: createParticlePending } =
    useCreateParticle({
      onError: (e) => toast(e.message, { type: "error" }),
      onSuccess: () =>
        toast("Particle created successfully", { type: "success" }),
    });

  const submitFunction = async (data: FormType) => {
    if (!data.japanese || !data.romaji) {
      toast("All fields except English are required", { type: "error" });
      return;
    }

    if (isEdit) {
      await editParticle({
        ...data,
        id: defaultValues?.id || "",
        english: data?.english ?? undefined,
      });
    } else {
      await createParticle({
        ...data,
        english: data?.english ?? undefined,
      });
    }
    form.reset();
    closeOpenedDialog();
    await refetchData();
    window.location.reload();
  };

  return (
    <DialogComponent title={`${type} Particle`} trigger={trigger}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitFunction)}
          className="space-y-4"
        >
          <FormInput
            label="Japanese"
            name="japanese"
            control={form.control}
            placeholder="Japanese"
            disabled={editParticlePending || createParticlePending}
          />
          <FormInput
            label="Romaji"
            name="romaji"
            control={form.control}
            placeholder="Romaji"
            disabled={editParticlePending || createParticlePending}
          />
          <FormInput
            label="English"
            name="english"
            control={form.control}
            placeholder="English"
            disabled={editParticlePending || createParticlePending}
          />
          <Button
            isLoading={editParticlePending || createParticlePending}
            type="submit"
          >
            {type.toUpperCase()}
          </Button>
        </form>
      </Form>
    </DialogComponent>
  );
};

export const SingleParticleRow = ({
  particle,
  refetchData,
}: {
  particle: SupabaseParticleType;
  refetchData: FetchFunctionType;
}) => {
  const { mutateAsync: deleteParticle, isPending: deleteParticlePending } =
    useDeleteParticle({ onError: (e) => toast(e.message, { type: "error" }) });

  return (
    <tr>
      <TableCell key={particle.id}>{particle?.japanese}</TableCell>
      <TableCell>{particle?.romaji}</TableCell>
      <TableCell>{particle?.english}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <SingleParticleDialog
            defaultValues={particle}
            type="edit"
            refetchData={refetchData}
            trigger={
              <Button>
                <PencilIcon size={16} />
              </Button>
            }
          />
          <Button
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to delete this particle "${particle.japanese} (${particle.romaji})" ?`,
                )
              ) {
                await deleteParticle(particle.id);
                toast("Question deleted successfully", { type: "success" });
                await refetchData();
              }
            }}
            variant="destructive"
            isLoading={deleteParticlePending}
          >
            <TrashIcon className="text-foreground" size={16} />
          </Button>
        </div>
      </TableCell>
    </tr>
  );
};
