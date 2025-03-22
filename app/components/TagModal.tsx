import { useForm } from "react-hook-form";
import { useState } from "react";

export type TagFormData = {
    selectedTag: string;
    newTag?: string;
};

interface TagModalProps {
    existingTags: string[];
    onSubmit: (data: TagFormData) => void;
    onClose: () => void;
}

export default function TagModal({ existingTags, onSubmit, onClose }: TagModalProps) {
    const { 
        register, 
        handleSubmit, 
        watch 
    } = useForm<TagFormData>({
        defaultValues: {
            selectedTag: 'create-new',
        }
    });

    const selectedTag = watch('selectedTag');
    const isCreatingNew = selectedTag === 'create-new';

    const onTagSubmit = (data: TagFormData) => {
        onSubmit({
            selectedTag: isCreatingNew ? data.newTag! : data.selectedTag
        });
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
            
            <div className="fixed inset-0 bg-white mx-auto my-auto rounded-lg shadow-xl p-6 w-96 max-w-[90vw] h-fit z-50">
                <form onSubmit={handleSubmit(onTagSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <select 
                            {...register("selectedTag")}
                            className="text-black w-full border rounded-md px-3 py-2 focus:outline-none"
                        >
                            <option value="create-new">Create new tag</option>
                            {existingTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>

                        {isCreatingNew && (
                            <input
                                type="text"
                                {...register("newTag", { 
                                    required: isCreatingNew,
                                    minLength: 1
                                })}
                                placeholder="Enter new tag name"
                                className="text-black w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-black rounded-md border-[1px] border-gray-300 active:bg-gray-200 w-fit self-end"
                    >
                        Add Tag
                    </button>

                </form>
            </div>
        </>
    );
}