import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { register as registerThunk } from '../store/slices/authSlice'
import { Link, useNavigate } from 'react-router-dom'

const schema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error } = useAppSelector((s) => s.auth)
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <div className="container flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="muted mt-1">Start managing tasks like a pro</p>
        </div>
        <div className="card">
          <form
            onSubmit={handleSubmit(async (v) => {
              const res = await dispatch(registerThunk(v))
              if ((res).meta.requestStatus === 'fulfilled') {
                navigate('/login')
              }
            })}
            className="space-y-4"
          >
            <div className="grid gap-1">
              <label className="text-sm font-medium" htmlFor="username">Username</label>
              <input id="username" className="input" placeholder="Your name" {...register('username')} />
              {formState.errors.username && (
                <p className="text-red-600 text-sm">{formState.errors.username.message}</p>
              )}
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input id="email" className="input" placeholder="you@example.com" {...register('email')} />
              {formState.errors.email && (
                <p className="text-red-600 text-sm">{formState.errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                placeholder="Create a strong password"
                type="password"
                {...register('password')}
              />
              {formState.errors.password && (
                <p className="text-red-600 text-sm">{formState.errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button className="btn w-full flex justify-center items-center" disabled={status === 'loading'}>
              {status === 'loading' ? 'Registering…' : 'Register'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm">
          Have an account? <Link className="font-medium" to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

