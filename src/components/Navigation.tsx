'use client'
import { CubeIcon } from '@heroicons/react/20/solid'
import {
  Avatar,
  Dropdown,
  Navbar,
  CustomFlowbiteTheme,
} from 'flowbite-react'
import useUserStore from './../store/useStore'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

type NavigationProps = {
  authenticated: boolean
}

interface JwtPayload {
  name?: string;
  email?: string;
  picture? : string;
}
export function Navigation({ authenticated }: NavigationProps) {
  const { userName,userEmail,userPicture, setProfileSettings, login, logout } = useUserStore()
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decodedToken = jwtDecode<JwtPayload>(credentialResponse.credential);
      console.log("Decoded token:", decodedToken);
      if (decodedToken.name && decodedToken.email && decodedToken.picture) {
        login(decodedToken.name,decodedToken.email,decodedToken.picture);
        console.log("User logged in:", decodedToken.name);
      } else {
        console.log("Name not found in JWT payload");
      }
    } else {
      console.log('Login Failed: No credential received');
    }
  };
  const NavbarTheme: CustomFlowbiteTheme['navbar'] = {
    root: {
      base: 'bg-transparent pt-4',
      inner: {
        base: 'mx-auto flex flex-wrap items-center justify-between',
      },
    },
    brand: {
      base: 'flex items-center',
    },
    collapse: {
      base: 'w-full md:block md:w-auto',
      list: 'mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium',
      hidden: {
        on: 'hidden',
        off: '',
      },
    },
    link: {
      base: 'block py-2 pl-3 pr-4 md:p-0',
      active: {
        on: ' text-white md:bg-transparent md:text-cyan-700',
        off: 'border-b border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white md:border-0  md:hover:bg-transparent md:hover:text-white',
      },
      disabled: {
        on: 'hover:cursor-not-allowed text-gray-600',
        off: '',
      },
    },
    toggle: {
      base: 'inline-flex items-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2  text-gray-400 hover:bg-gray-700 focus:ring-gray-600 md:hidden',
      icon: 'h-6 w-6 shrink-0',
    },
  }


  const DropdownTheme: CustomFlowbiteTheme['dropdown'] = {
    arrowIcon: "ml-2 h-4 w-4",
    content: "py-1 focus:outline-none",
    floating: {
      animation: "transition-opacity",
      arrow: {
        base: "absolute z-10 h-2 w-2 rotate-45",
        style: {
          auto: "bg-gray-700"
        },
        placement: "-4px"
      },
      base: "z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none",
      content: "py-1 text-sm text-gray-200",
      divider: "my-1 h-px bg-gray-600",
      header: "block px-4 py-2 text-sm text-gray-200",
      hidden: "invisible opacity-0",
      item: {
        container: "",
        base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white focus:bg-gray-600 focus:text-white",
        icon: "mr-2 h-4 w-4"
      },
      style: {
        auto: "border border-none bg-gray-700 text-white"
      },
      target: "w-fit"
    },
    inlineWrapper: "flex items-center"
  }
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
        {authenticated ? (
          <Dropdown
            theme={DropdownTheme}
            arrowIcon={false}
            inline
            className='pb-4'
            label={
              <Avatar
                alt='User settings'
                img={userPicture ?userPicture:'https://flowbite.com/docs/images/people/profile-picture-5.jpg'}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>{userName || 'User'}</span>
              <span className='block truncate text-sm font-medium'>
                {userEmail || 'Email'}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => setProfileSettings(true)}>Profile Settings</Dropdown.Item>
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
