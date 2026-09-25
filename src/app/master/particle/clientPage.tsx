"use client";

import { Button } from "@/components/ui/button";
import {
  SingleParticleDialog,
  SingleParticleRow,
} from "@/components/Molecules/Upload/Particles/Single";
import { useGetParticles } from "@/services/get-particles/useGetParticles";
import { Spinner } from "@/components/ui/spinner";
import { TableHeader } from "@/components/Atoms/Table/Table";
import { FetchFunctionType } from "@/app/upload/clientPage";

export const ParticleClientPage = () => {
  const {
    data: particles,
    isPending,
    refetch: refetchParticle,
  } = useGetParticles();

  const refetch: FetchFunctionType = async () => {
    refetchParticle();
  };

  return (
    <div className="p-5">
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <h1 className="text-xl font-bold">Particle List</h1>
          <div className="p-5">
            <div className="pb-3">
              <SingleParticleDialog
                type="create"
                refetchData={refetch}
                trigger={<Button>Create Particle</Button>}
              />
            </div>
            {!(particles || []).length ? (
              <div>No particles registered</div>
            ) : (
              <table>
                <tbody>
                  <tr>
                    <TableHeader>Japanese</TableHeader>
                    <TableHeader>Romaji</TableHeader>
                    <TableHeader>English</TableHeader>
                    <TableHeader></TableHeader>
                  </tr>
                  {particles?.map((particle) => (
                    <SingleParticleRow
                      key={particle.id}
                      refetchData={refetch}
                      particle={particle}
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
