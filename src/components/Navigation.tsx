'use client'
import { CubeIcon } from '@heroicons/react/20/solid'
import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import useUserStore from './../store/useStore'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { useLoginWithGoogle } from '../services/auth'
import { getTheme } from '../theme/themeUtils';

export function Navigation() {
  const { 
    user,
    isAuthenticated,
    login,
    logout,
    setProfileSettings
   } = useUserStore()

  const { mutate: loginMutation } = useLoginWithGoogle();

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      loginMutation(credentialResponse.credential, {
        onSuccess: (data) => {
          login(data.token, data.user);
        },
        onError: (error) => {
          console.error('Login failed:', error);
        },
      });
    } else {
      console.log('Login Failed: No credential received');
    }
  }
  const NavbarTheme = getTheme("NavbarTheme")
  const DropdownTheme = getTheme("DropdownTheme")
  return (
    <Navbar theme={NavbarTheme}>
      <Navbar.Brand href='https://flowbite-react.com'>
        <div className='flex items-center'>
          <CubeIcon className='h-9 w-9 text-white' />
          <h1 className='text-4xl font-semibold ml-4 pb-4'>
            <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
              {'Memory Lane'}
            </span>
          </h1>
        </div>
      </Navbar.Brand>
      <div className=' flex flex-1 justify-end'>
        {isAuthenticated ? (
          <Dropdown
            theme={DropdownTheme}
            arrowIcon={false}
            inline
            className='pb-4'
            label={
              <Avatar
                alt='User settings'
                img={
                  user?.picture ||
                  'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                }
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>{user?.name || 'User'}</span>
              <span className='block truncate text-sm font-medium'>
                {user?.email || 'Email'}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setProfileSettings(true)}>
              Profile Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => logout()}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <div className='flex md:order-2'>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.warn('Login Failed')
              }}
              useOneTap
            />
            <Navbar.Toggle />
          </div>
        )}
      </div>
    </Navbar>
  )
}
