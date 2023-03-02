import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import useLogin from '@/hooks/useLogin'


export default function () {
  const { register, formState: { errors }, handleSubmit } = useForm<LoginFormState>()
  const { handlePasswordLogin } = useLogin()

  const onSubmit: SubmitHandler<LoginFormState> = (data) => {
    handlePasswordLogin(data)
  }

  return (
    <form className='h-full' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextField error={!!errors.username} {...register('username', { required: true, maxLength: 20 })} fullWidth label="用户名" variant="standard" />
      </div>
      <div className="mt-4">
        <TextField {...register('password', { required: true, maxLength: 20 })} fullWidth label="密码" variant="standard" type="password" />
      </div>

      <Button className='!mt-4' variant="contained" fullWidth type="submit">提交</Button>
    </form>
  )
}
