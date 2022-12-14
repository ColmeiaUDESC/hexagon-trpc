import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import SEO from '../components/SEO';
import { getServerAuthSession } from '../server/common/get-server-auth-session';

interface FormValues {
  email: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const response = await signIn('credentials', {
      redirect: false,
      callbackUrl: '/dashboard',
      email: data.email,
      password: data.password
    });

    if (response?.error) {
      toast({
        title: 'Algo deu errado!',
        description: 'Verifique as informações e tente novamente.',
        status: 'error',
        duration: 3500,
        position: 'top-right'
      });
    }

    if (response?.url) {
      router.push('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <>
      <SEO title="Login" />
      <Center w="full" h="100vh" bg="gray.50">
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={{ base: 'transparent', md: 'white' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl isInvalid={Boolean(errors.email)}>
                    <FormLabel htmlFor="email">Endereço de email</FormLabel>
                    <Input
                      id="email"
                      type="text"
                      {...register('email', {
                        required: 'Campo não preenchido.',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Endereço de email inválido.'
                        }
                      })}
                    />
                    {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                  </FormControl>

                  <FormControl isInvalid={Boolean(errors.password)}>
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register('password', {
                        required: 'Campo não preenchido'
                      })}
                    />
                    {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                  </FormControl>
                </Stack>
                <HStack justify="space-between">
                  <Checkbox colorScheme="yellow">Permanecer conectado</Checkbox>
                  <Button variant="link" size="sm" colorScheme="yellow">
                    Esqueceu sua senha?
                  </Button>
                </HStack>
                <Stack spacing="6">
                  <Button type="submit" colorScheme="yellow" isLoading={isLoading}>
                    Entrar
                  </Button>
                  <Box textAlign="center">
                    <Text color="muted">
                      Você ainda não tem uma conta?{' '}
                      <Link href="/register">
                        <Button variant="link" colorScheme="yellow">
                          Registre-se
                        </Button>
                      </Link>
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Container>
      </Center>
    </>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};

export default LoginPage;
