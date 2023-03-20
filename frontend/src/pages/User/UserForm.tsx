import { useForm, SubmitHandler } from 'react-hook-form';

interface UserFormInput {
  groupName: string;
  url: string;
  user: string;
}

interface UserFormProps {
  defaultUpdateValue?: any;
}

const UserForm = ({ defaultUpdateValue }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormInput>();
  const submitHandler: SubmitHandler<UserFormInput> = (data: UserFormInput) =>
    console.log(data);
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <label htmlFor="groupName">
        Group Name
        <input
          defaultValue={defaultUpdateValue?.group_name ?? ''}
          {...register('groupName', { required: true })}
        />
        {errors.groupName && <span>Group Name field is required</span>}
      </label>
      <label htmlFor="url">
        URL
        <input {...register('url', { required: true })} />
        {errors.url && <span>URL field is required</span>}
      </label>
      <label htmlFor="user">
        User
        <input {...register('user', { required: true })} />
        {errors.user && <span>User field is required</span>}
      </label>
      <input type="submit" />
    </form>
  );
};

export default UserForm;
