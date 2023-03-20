import { Button, Container, Flex, Heading, Input } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React from "react";

function PropertyList(props) {
  const onBtnSwitch = () => {};
  const onBtnEdit = () => {};
  return (
    <>
      <Flex direction="column">
        <Heading size="md">Search by</Heading>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>City</FormLabel>
          <Input />
        </FormControl>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input />
        </FormControl>
      </Flex>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>City</Th>
              <Th>Address</Th>
              <Th>Active</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
              <Td>
                <Switch colorScheme="green" onChange={() => onBtnSwitch()} />
              </Td>
              <Td>
                <Button onClick={() => onBtnEdit()} colorScheme="green">
                  Edit
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PropertyList;
