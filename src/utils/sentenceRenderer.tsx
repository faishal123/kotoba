import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import {
  SentenceJSON,
  SentenceWord,
  WordComponent,
  PartialSentenceJSON,
} from "@/models/sentence";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  PlusIcon,
  Save,
  Trash,
} from "lucide-react";
import { FormInput } from "@/components/Atoms/Form/FormInput";

type WordProperty = "japanese" | "furigana" | "romaji" | "english";

type ComponentProperty = "furigana" | "romaji" | "english" | "kanji";

type OnChangeInputType = (
  param:
    | {
        value: string;
        property: WordProperty;
        index: [number];
      }
    | {
        value: string;
        property: ComponentProperty;
        index: [number, number];
      },
) => void;

type OnMoveItemType = <T>(
  index: number,
  direction: "up" | "down",
  fullList: T[],
  callBack: (param: T[]) => void,
) => void;

type OnAddComponentType = (wordIndex: number) => void;

type OnDeleteInputType = (index: [number] | [number, number]) => void;

interface WordStateType extends Partial<SentenceWord> {
  showInput: boolean;
  id: string;
}

export const SentenceRenderer = ({
  sentence,
  showFurigana,
}: {
  sentence: SentenceJSON;
  showFurigana?: boolean;
}) => {
  return sentence.map((t) => {
    const hasComponents = (t?.components || [])?.length > 0;
    if (hasComponents && showFurigana) {
      return t?.components?.map((c) => (
        <ruby key={`${c?.furigana}${c?.kanji}`}>
          {c?.kanji}
          <rt>{c?.furigana}</rt>
        </ruby>
      ));
    }
    return <span key={`${t?.furigana}${t?.japanese}`}>{t?.japanese}</span>;
  });
};

const SingleComponent = ({
  component,
  index,
  wordIndex,
  onChangeInput,
  onDeleteInput,
}: {
  component: WordComponent;
  index: number;
  wordIndex: number;
  onChangeInput: OnChangeInputType;
  onDeleteInput: OnDeleteInputType;
}) => {
  const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    property: ComponentProperty,
  ) => {
    onChangeInput({
      value: e?.target?.value,
      property: property,
      index: [wordIndex, index],
    });
  };
  return (
    <div className="px-2 flex items-center gap-4">
      <div className="flex-1">
        <div>
          <span className="font-bold">Kanji: </span>
          <Input
            id={`word-${wordIndex}-component-${index}-kanji`}
            placeholder="Component Kanji"
            value={component?.kanji}
            onChange={(e) => {
              onChange(e, "kanji");
            }}
          />
        </div>
        <div>
          <span className="font-bold">Furigana: </span>
          <Input
            id={`word-${wordIndex}-component-${index}-furigana`}
            placeholder="Component Furigana"
            value={component?.furigana}
            onChange={(e) => {
              onChange(e, "furigana");
            }}
          />
        </div>
        <div>
          <span className="font-bold">Romaji: </span>
          <Input
            id={`word-${wordIndex}-component-${index}-romaji`}
            placeholder="Component Romaji"
            value={component?.romaji}
            onChange={(e) => {
              onChange(e, "romaji");
            }}
          />
        </div>
        <div>
          <span className="font-bold">English: </span>
          <Input
            id={`word-${wordIndex}-component-${index}-english`}
            placeholder="Component English"
            value={component?.english}
            onChange={(e) => {
              onChange(e, "english");
            }}
          />
        </div>
      </div>
      <div>
        <Button
          onClick={() => {
            onDeleteInput([wordIndex, index]);
          }}
          size={"sm"}
          variant={"destructive"}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
};

const SingleWord = ({
  word,
  onMoveUp,
  onMoveDown,
  index,
  onAddComponent,
  toggleShowInput,
  onChangeInput,
  onDeleteInput,
}: {
  word: WordStateType;
  onMoveUp: () => void;
  onMoveDown: () => void;
  index: number;
  onAddComponent: OnAddComponentType;
  toggleShowInput: (index: number) => void;
  onChangeInput: OnChangeInputType;
  onDeleteInput: OnDeleteInputType;
}) => {
  const showInput = word?.showInput;
  // const id = word?.id;

  const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    property: WordProperty,
  ) => {
    onChangeInput({
      value: e?.target?.value,
      property: property,
      index: [index],
    });
  };

  const components = word?.components;

  const componentsArray = components?.reduce<ReactNode[]>((a, c, i) => {
    return [
      ...a,
      <SingleComponent
        key={`${c.kanji}${i}`}
        onDeleteInput={onDeleteInput}
        onChangeInput={onChangeInput}
        index={i}
        wordIndex={index}
        component={c}
      />,
      ...(i + 1 === components?.length
        ? []
        : [
          <div
            key={i}
            className="w-full border-b border-gray-300 pt-[4px]"
            ></div>,
          ]),
    ];
  }, []);

  return (
    <div className="space-y-2 border border-primary rounded-md p-4">
      <div className="flex gap-2 justify-center">
        {!showInput && (
          <>
            <Button
              onClick={() => {
                onDeleteInput([index]);
              }}
              size={"sm"}
              variant={"destructive"}
            >
              <Trash /> Delete
            </Button>
            <Button onClick={onMoveUp} size={"sm"} variant={"secondary"}>
              <ChevronUp /> Move Up
            </Button>
            <Button onClick={onMoveDown} size={"sm"} variant={"secondary"}>
              <ChevronDown /> Move Down
            </Button>
          </>
        )}
        {showInput ? (
          <Button
            onClick={() => {
              toggleShowInput(index);
            }}
            size={"sm"}
          >
            <Save /> Save
          </Button>
        ) : (
          <Button
            onClick={() => {
              toggleShowInput(index);
            }}
            size={"sm"}
          >
            <Pencil /> Edit
          </Button>
        )}
      </div>
      {!showInput && (
        <div className="flex justify-center text-4xl font-bold">
          {word?.japanese}
        </div>
      )}
      {showInput && (
        <div>
          <div>
            <span className="font-bold">Japanese: </span>
            <Input
              id={`word-${index}-japanese`}
              placeholder="Word Japanese"
              value={word?.japanese}
              onChange={(e) => {
                onChange(e, "japanese");
              }}
            />
          </div>
          <div>
            <span className="font-bold">Furigana: </span>
            <Input
              id={`word-${index}-furigana`}
              placeholder="Word Furigana"
              value={word?.furigana}
              onChange={(e) => {
                onChange(e, "furigana");
              }}
            />
          </div>
          <div>
            <span className="font-bold">Romaji: </span>
            <Input
              id={`word-${index}-romaji`}
              placeholder="Word Romaji"
              value={word?.romaji}
              onChange={(e) => {
                onChange(e, "romaji");
              }}
            />
          </div>
          <div>
            <span className="font-bold">English: </span>
            <Input
              id={`word-${index}-english`}
              placeholder="Word English"
              value={word?.english}
              onChange={(e) => {
                onChange(e, "english");
              }}
            />
          </div>

          <div className="space-y-4 border border-gray-300 p-2 mt-2 rounded-md">
            <span className="font-bold">Components:</span>
            {componentsArray}
            <Button
              onClick={() => {
                onAddComponent(index);
              }}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              <PlusIcon /> Add Component
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const SentenceInputRenderer = <FormType extends FieldValues>({
  defaultSentence = [],
  control,
  name,
  setValue,
}: {
  defaultSentence?: PartialSentenceJSON;
  control: Control<FormType>;
  name: Path<FormType>;
  setValue: (value: string) => void;
}) => {
  const [sentence, setSentence] = useState<WordStateType[]>(
    defaultSentence.map((word) => ({
      ...word,
      showInput: false,
      id: crypto.randomUUID(),
    })),
  );

  useEffect(() => {
    console.log(
      "sentence full",
      sentence,
      sentence.reduce((a, c) => {
        return `${a}${c?.japanese || ""}`;
      }, ""),
    );
    const newValue = JSON.stringify(
      sentence.reduce<PartialSentenceJSON>((a, c) => {
        return [
          ...a,
          {
            components: c?.components,
            romaji: c?.romaji,
            english: c?.english,
            furigana: c?.furigana,
            japanese: c?.japanese,
          },
        ];
      }, []),
    );
    setValue(newValue);
  }, [sentence]);

  const onAddWord = () => {
    setSentence((prev) => [
      ...prev,
      { showInput: true, id: crypto.randomUUID() },
    ]);
  };

  const onMoveItem: OnMoveItemType = <T,>(
    index: number,
    direction: "up" | "down",
    fullList: T[],
    callBack: (param: T[]) => void,
  ) => {
    const currentItem = fullList?.[index];
    const swapItemIndex = direction === "up" ? index - 1 : index + 1;
    const swapItem = fullList?.[swapItemIndex];

    if (swapItem) {
      const newList = fullList.reduce<T[]>((a, c, i) => {
        if (i === index) {
          return [...a, swapItem];
        }
        if (i === swapItemIndex) {
          return [...a, currentItem];
        }
        return [...a, c];
      }, []);

      callBack(newList);
    }
  };

  const onAddComponent = (wordIndex: number) => {
    setSentence((prev) =>
      prev.reduce<WordStateType[]>((a, c, i) => {
        if (i === wordIndex) {
          return [
            ...a,
            {
              ...c,
              components: [
                ...(c?.components || []),
                { kanji: "", romaji: "", furigana: "", english: "" },
              ],
            },
          ];
        }
        return [...a, c];
      }, []),
    );
  };

  const toggleShowInput = (index: number) => {
    setSentence((prev) =>
      prev.reduce<WordStateType[]>((a, c, i) => {
        if (i === index) {
          return [...a, { ...c, showInput: !c?.showInput }];
        }
        return [...a, c];
      }, []),
    );
  };

  const onDeleteInput: OnDeleteInputType = (index) => {
    setSentence((prev) => {
      const wordIndex = index?.[0];
      const componentIndex = index?.[1];
      const componentIsEdited =
        componentIndex !== undefined && componentIndex !== null;

      return prev.reduce<WordStateType[]>((a, c, i) => {
        if (i === wordIndex) {
          if (componentIsEdited) {
            return [
              ...a,
              {
                ...c,
                components: c?.components?.filter(
                  (component, currentComponentIndex) =>
                    currentComponentIndex !== componentIndex,
                ),
              },
            ];
          }
          return a;
        }
        return [...a, c];
      }, []);
    });
  };

  const onChangeInput: OnChangeInputType = (param) => {
    setSentence((prev) => {
      const wordIndex = param?.index?.[0];
      const componentIndex = param?.index?.[1];

      const componentIsEdited =
        componentIndex !== undefined && componentIndex !== null;

      const { property, value } = param;

      const newState = prev.reduce<WordStateType[]>((a, c, i) => {
        if (i === wordIndex) {
          let components = c?.components;
          if (componentIsEdited) {
            components = components?.reduce<WordComponent[]>(
              (componentA, componentC, componentI) => {
                if (componentI === componentIndex) {
                  return [...componentA, { ...componentC, [property]: value }];
                }
                return [...componentA, componentC];
              },
              [],
            );
          }
          return [
            ...a,
            {
              ...c,
              components,
              ...(componentIsEdited ? {} : { [property]: value }),
            },
          ];
        }
        return [...a, c];
      }, []);

      return newState;
    });
  };

  return (
    <>
      <div className="space-y-4">
        {sentence?.map((word, i) => {
          return (
            <SingleWord
              onDeleteInput={onDeleteInput}
              onChangeInput={onChangeInput}
              toggleShowInput={toggleShowInput}
              onAddComponent={onAddComponent}
              onMoveDown={() => {
                onMoveItem(i, "down", sentence, (newList) => {
                  setSentence(newList);
                });
              }}
              onMoveUp={() => {
                onMoveItem(i, "up", sentence, (newList) => {
                  setSentence(newList);
                });
              }}
              index={i}
              key={word?.id}
              word={word}
            />
          );
        })}
        <Button onClick={onAddWord} className="w-full">
          <PlusIcon /> Add Word
        </Button>
      </div>
      <div className="m-0 h-[0px] overflow-hidden">
        <FormInput control={control} name={name} />
      </div>
    </>
  );
};
