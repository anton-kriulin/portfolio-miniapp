'use client'
import { useForm } from 'react-hook-form';
import { IconButton } from '@/components'
import { Config } from '@/lib/Config';
import { ISearchFormData } from '@/lib/Types';
import { useSession } from '@/hooks';
import { CloseIcon, SearchIcon } from '@/assets/icons';
import './styles.css'

interface SearchInputProps {
    onSubmit: (data: ISearchFormData) => void
    onClear: () => void
}

export const SearchInput = ({ onSubmit, onClear }: SearchInputProps) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        resetField
    } = useForm<ISearchFormData>();

    const {phrases} = useSession();

    return (
        <form className="search-row" onSubmit={handleSubmit(onSubmit)}>
            <div className="search-row-search">
                <IconButton
                    type="submit"
                >
                    <SearchIcon color={Config.colors.SecondaryText} />
                </IconButton>
            </div>
            <div className="search-row-clear">
                <IconButton
                    type="reset"
                    onPress={onClear}
                >
                    <CloseIcon color={Config.colors.SecondaryText} size={26} />
                </IconButton>
            </div>
            <div className="search-row-input">
                <input
                    type="text"
                    className="secondary-input"
                    placeholder={phrases.search}
                    {...register("search", { required: false })}
                />
            </div>
        </form>
    );
}