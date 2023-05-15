/* eslint-disable no-underscore-dangle */
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { RiUserAddLine } from 'react-icons/ri';
import { RxCrossCircled } from 'react-icons/rx';
import { BsCheckCircle } from 'react-icons/bs';
import { useAppSelector } from '../../store';
import { useClickOutsideSingle } from '../../hooks/useClickOutside';
import Select, { SelectOption } from '../../components/Select';
import type { userGroupType, allUserType } from '../../types';
import { USER_GROUP, USER, USER_EVENT } from '../../data/fetchUrl';
import { useAuthenticatedMutation } from '../../hooks/useAuthenticatedMutation';
import { useAuthenticatedMutations } from '../../hooks/useAuthenticatedMutations';

const options: SelectOption[] = [
  { label: 'Please select', value: 'Please select' },
  { label: 'Guest', value: 'Guest' },
  { label: 'Engineer', value: 'Engineer' },
  { label: 'Site Vender', value: 'Site Vender' },
];

type FormValues = 'user' | 'GroupName' | 'teams_url' | 'AccessLevel' | 'Description';

export type GroupFormInput = {
  GroupName: string;
  teams_url: string;
  user?: string[];
  AccessLevel: string;
  Description: string;
};

interface GroupFormProps {
  toggleModal: () => void;
  defaultUpdateValue?: userGroupType;
  userData: allUserType[];
}
type webhookMessage = {
  title: string;
  text: string;
};

const GroupForm = ({ toggleModal, defaultUpdateValue, userData }: GroupFormProps) => {
  const queryClient = useQueryClient();
  const usersInputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputWidth, setInputWidth] = useState(2);
  const [showList, setShowList] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [testWebhookIsSuccess, setTestWebhookIsSuccess] = useState<boolean | null>(null);
  const permission = useAppSelector((state) => state.user.permission);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setFocus,
    control,
  } = useForm<GroupFormInput>({
    criteriaMode: 'all',
  });

  useEffect(() => {
    if (
      permission === 'Developer' &&
      !options.some((option) => option.value === 'Developer')
    ) {
      options.push({ label: 'Developer', value: 'Developer' });
    }
  }, [permission]);

  useEffect(() => {
    setFocus('GroupName');
  }, [setFocus]);

  useEffect(() => {
    if (showList) {
      setHighlighted(0);
    }
  }, [showList]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== usersInputRef.current) return;
      switch (e.code) {
        case 'Enter':
        case 'Space':
          if (showList) {
            selectUserHandler(filteredNames[highlighted].username, e);
          }
          break;
        case 'ArrowUp':
          setHighlighted((prev) => (prev === 0 ? prev : prev - 1));
          break;
        case 'ArrowDown':
          if (!showList) setShowList(true);
          setHighlighted((prev) => (prev === filteredNames.length - 1 ? prev : prev + 1));
          break;
        case 'Escape':
          setShowList(false);
          break;
        default:
          break;
      }
    };
    usersInputRef.current?.addEventListener('keydown', handler);
    return () => {
      usersInputRef.current?.removeEventListener('keydown', handler);
    };
  });

  const loopTabKey = (
    e: {
      key: string;
      shiftKey: boolean;
      preventDefault: () => void;
    },
    lastElement: FormValues,
  ) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      setFocus(lastElement);
    }
  };

  useEffect(() => {
    const submitBtn = submitButtonRef.current;
    submitBtn?.addEventListener('keydown', (e) => loopTabKey(e, 'GroupName'));
    return () => {
      submitBtn?.removeEventListener('keydown', (e) => loopTabKey(e, 'GroupName'));
    };
  }, []);

  const webhookURL = new URL(USER_EVENT);
  webhookURL.searchParams.append('webhook', watch('teams_url'));
  const sendMessageMutation = useAuthenticatedMutation<webhookMessage, Error>(
    webhookURL.toString(),
    'PUT',
    {},
  );

  const handleSendMessage = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      await sendMessageMutation.mutateAsync({
        queryParams: {},
        body: {},
      });
      setTestWebhookIsSuccess(true);
    } catch (error) {
      setTestWebhookIsSuccess(false);
    }
  };

  const updateGroupMutation = useAuthenticatedMutation(USER_GROUP, 'PUT', {
    onSuccess: () => {
      queryClient.invalidateQueries(['userGroup']);
      queryClient.invalidateQueries(['allUser']);
    },
  });
  const updateGroupHandler = async (data: GroupFormInput) => {
    await updateGroupMutation.mutateAsync({
      queryParams: {},
      body: {
        GroupName: data.GroupName,
        teams_url: data.teams_url,
        AccessLevel: data.AccessLevel,
        Description: data.Description,
      },
    });
  };

  const updateUserMutation = useAuthenticatedMutations(USER, 'PUT', {
    onSuccess: () => {
      queryClient.invalidateQueries(['allUser']);
    },
  });
  const updateUsersHandler = async (data: GroupFormInput) => {
    const query = {};
    const body = tags.map((user) => ({
      username: user,
      group: data.GroupName,
    }));

    await updateUserMutation.mutateAsync({ query, body });
  };

  const submitHandler: SubmitHandler<GroupFormInput> = async (data: GroupFormInput) => {
    if (defaultUpdateValue) {
      data.GroupName = defaultUpdateValue.GroupName;
    }
    data.user = tags;

    try {
      await updateGroupHandler(data);
      await updateUsersHandler(data);
      toggleModal();
    } catch (error) {
      setErrorMsg('Not able to submit! Please try again later.');
    }
  };

  const filteredNames = userData?.filter(
    (user: allUserType) =>
      !tags.includes(user.username) &&
      !user.username.startsWith('admin') &&
      user.username.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const removeTag = (tag: string) => {
    const newTags = tags.filter((item) => item !== tag);
    setTags(newTags);
    setShowList(false);
  };
  const selectUserHandler = (name: string, event?: any) => {
    event?.preventDefault();
    setTags([...tags, name]);
    setInputValue('');
  };

  const { domNode } = useClickOutsideSingle<HTMLUListElement>(() => {
    setShowList(false);
  });

  const widthHandler = (event: { target: { value: string } }) => {
    setInputValue(event.target.value);
    setInputWidth(event.target.value.length * 8 + 2);
  };

  const clickUsersInputHandler = () => {
    setShowList(true);
    setFocus('user');
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="formInputWrapper relative flex h-full w-full min-w-[330px] flex-col items-start gap-6 pl-6 text-gray-200"
    >
      <section className="grid w-full grid-cols-2 gap-10">
        <label htmlFor="groupName" className="text-lg font-semibold">
          Group Name
          <input
            disabled={!!defaultUpdateValue}
            defaultValue={defaultUpdateValue?.GroupName ?? ''}
            {...register('GroupName', {
              ...(!defaultUpdateValue ? { required: 'This input is required.' } : {}),
              pattern: {
                value: /^[^\u4e00-\u9fa5]*$/gm,
                message: 'This input cannot contain Chinese characters.',
              },
            })}
            className="formInput"
            autoComplete="off"
          />
          <ErrorMessage
            errors={errors}
            name="GroupName"
            render={({ messages }) => {
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p className="errorMessage" key={type}>
                      {message}
                    </p>
                  ))
                : null;
            }}
          />
        </label>
        <div className="relative flex justify-end">
          <span className="relative text-lg font-semibold">
            Access Level
            <Controller
              name="AccessLevel"
              control={control}
              rules={{
                required: 'This input is required?',
              }}
              defaultValue={defaultUpdateValue?.AccessLevel ?? ''}
              render={({ field }: { field: any }) => (
                <Select
                  {...field}
                  style={{ width: '17rem', zIndex: 70 }}
                  // Custom onChange event handler to get the selected value
                  onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                  options={options}
                  value={options.find((option) => option.value === field.value)}
                  ref={selectRef}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="AccessLevel"
              render={({ messages }) => {
                return messages
                  ? Object.entries(messages).map(([type, message]) => (
                      <p className="errorMessage" key={type}>
                        {message}
                      </p>
                    ))
                  : null;
              }}
            />
          </span>
        </div>
      </section>
      {!defaultUpdateValue ? (
        <section className="w-full">
          <label htmlFor="user" className="text-lg font-semibold">
            Users
            <div
              className={`formInput inputFullWidth relative flex ${
                tags.length > 0 || showList ? ' bg-[#F5F5F5]' : 'bg-transparent'
              }`}
              // tabIndex={0}
              // onClick={clickUsersInputHandler}
            >
              <ul>
                {tags.map((tag, index) => {
                  return (
                    <Tag
                      tag={tag}
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      remove={() => removeTag(tag)}
                    />
                  );
                })}
              </ul>
              <input
                className="grow bg-transparent outline-none focus:outline-none"
                style={{ width: `${inputWidth}px` }}
                {...register('user')}
                autoComplete="off"
                placeholder={`${
                  tags.length > 0 ? '' : 'Search for users by name, e.g. "John Doe"'
                }`}
                value={inputValue}
                onChange={widthHandler}
                onClick={clickUsersInputHandler}
                onFocus={clickUsersInputHandler}
                ref={usersInputRef}
              />
              {showList && (
                <ul
                  className="scrollBarStyle divOption absolute z-10 ml-[10%] max-h-[15em] w-3/4 overflow-y-auto rounded-md bg-white drop-shadow-xl"
                  ref={domNode}
                >
                  {filteredNames?.map((name: allUserType, index) => {
                    return (
                      <button
                        tabIndex={-1}
                        key={name._id.$oid}
                        className={`z-10 flex w-full items-center gap-6 border-l-2 border-white px-4 py-2 hover:cursor-pointer hover:border-l-2 hover:border-wiwynn-blue ${
                          index === highlighted ? 'bg-[#dadce4]' : ''
                        }`}
                        onMouseEnter={() => setHighlighted(index)}
                        onClick={(event) => {
                          event.stopPropagation();
                          selectUserHandler(name.username, event);
                          setShowList(false);
                        }}
                      >
                        <RiUserAddLine size={25} />
                        <div className="flex h-full flex-col justify-center">
                          <div className="flex gap-2">
                            <span className="font-bold">{name.username}</span>
                            <span className="font-bold">{name.department}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-sm">{name.employeeID}</span>
                            <span className="text-sm">{name.mail}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </ul>
              )}
            </div>
            <ErrorMessage
              errors={errors}
              name="user"
              render={({ messages }) => {
                return messages
                  ? Object.entries(messages).map(([type, message]) => (
                      <p className="errorMessage" key={type}>
                        {message}
                      </p>
                    ))
                  : null;
              }}
            />
          </label>
        </section>
      ) : null}
      <section className="w-full">
        <label htmlFor="url" className="text-lg font-semibold">
          Webhook URL
          <div className="flex w-full items-center">
            {testWebhookIsSuccess === true ? (
              <BsCheckCircle size={25} className="text-wiwynn-green" />
            ) : null}
            {testWebhookIsSuccess === false ? (
              <RxCrossCircled size={25} className="text-red" />
            ) : null}
            <div className="relative grow">
              <input
                defaultValue={defaultUpdateValue?.teams_url ?? ''}
                {...register('teams_url', {
                  required: 'This input is required.',
                  pattern: {
                    value: /^https:/,
                    message: 'This input must start with https.',
                  },
                })}
                className="formInput inputFullWidth"
                autoComplete="off"
                placeholder='Enter webhook URL, e.g. "https://cloudadmwiwynn..."'
                onFocus={() => {
                  setShowList(false);
                }}
              />
              <button
                type="button"
                disabled={testWebhookIsSuccess === true}
                className="absolute inset-y-0 right-0 z-30 rounded-r-lg bg-[#dadce4] px-4 text-sm text-[#363434] disabled:cursor-default disabled:bg-[#e4e6ec] disabled:text-[#a8a8a8]"
                onClick={handleSendMessage}
              >
                Test hook
              </button>
            </div>
          </div>
          <ErrorMessage
            errors={errors}
            name="teams_url"
            render={({ messages }) => {
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p className="errorMessage" key={type}>
                      {message}
                    </p>
                  ))
                : null;
            }}
          />
        </label>
      </section>
      <section className="w-full">
        <label htmlFor="description" className="text-lg font-semibold">
          Description
          <div className="relative">
            <textarea
              defaultValue={defaultUpdateValue?.Description ?? ''}
              {...register('Description')}
              className="formInput inputFullWidth"
              autoComplete="off"
              placeholder=""
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="Description"
            render={({ messages }) => {
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p className="errorMessage" key={type}>
                      {message}
                    </p>
                  ))
                : null;
            }}
          />
        </label>
      </section>

      <section className="flex w-full grow items-end justify-end">
        <p
          className={`errorMessage m-0 mr-6 mt-[-2rem] ${
            errorMsg ? 'block animate-shake' : 'hidden'
          }
          }`}
        >
          {errorMsg}
        </p>
        <button
          ref={submitButtonRef}
          className="rounded-xl bg-wiwynn-blue px-8 py-2 font-semibold tracking-wide text-white"
        >
          Submit
        </button>
      </section>
    </form>
  );
};

type tagProps = {
  tag: string;
  remove: () => void;
};

const Tag = ({ remove, tag }: tagProps) => {
  const removeTagHandler = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    event.preventDefault();
    event.stopPropagation();
    remove();
  };
  return (
    <li className="m-[3px] inline-block w-fit rounded-3xl bg-white py-[3px] px-[5px] text-[11pt] text-black hover:cursor-pointer">
      <span className="ml-3 text-gray-200">{tag}</span>
      <button
        className="ml-[0.5rem] px-[2px] text-[#666] no-underline hover:text-[#dd3345]"
        onClick={removeTagHandler}
      >
        x
      </button>
    </li>
  );
};

export default GroupForm;
