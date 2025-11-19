import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { createFileRoute } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/search/user')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [searchText, setSearchText] = useState('');

  return (
    <div>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={searchText}
          placeholder={t('search')}
          onInput={(e) => {
            setSearchText(e.currentTarget.value);
          }}
          onKeyUp={(e) => {
            if (e.key == 'Enter') {
              setQuery(e.currentTarget.value);
            }
          }}
        />
      </InputGroup>
      {query}
    </div>
  );
}
