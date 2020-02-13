import React from 'react';
import { addons, types } from '@storybook/addons';
import styled from '@emotion/styled';
import { ADDON_ID } from './constants';

const Label = styled.label`
  margin-right: 5px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const Input = styled.input`
  border-radius: 3px;
  border: 1px solid #eee;
  padding: 3px 5px;
`;

/**
 * Gets a cookie by name.
 * @param name The name of the target cookie
 */
function getCookie(name: string): string | undefined {
  const cookies: { [key: string]: string } = {};
  document.cookie
    .split(';')
    .map(cookie => cookie.split('=').map(part => part.trim()))
    .forEach(cookie => {
      cookies[cookie[0]] = cookie[1];
    });
  return cookies[name];
}

/**
 * Gets the saved branch name from the cookie or returns the default branch.
 */
function getSavedBranch() {
  return getCookie('branch') || 'master';
}

let currentValue = getSavedBranch();

/**
 * When the branch form is submitted. Saves the new value into the cookie and
 * refreshes the page.
 */
function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  document.cookie = `branch=${currentValue};path=/`;
  location.href = location.href;
}

addons.register(ADDON_ID, api => {
  addons.add(ADDON_ID, {
    title: 'Preview Branch',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => (
      <Form onSubmit={onSubmit}>
        <Label htmlFor="preview-branch">Branch:</Label>
        <Input
          id="preview-branch"
          type="text"
          defaultValue={currentValue}
          onChange={event => (currentValue = event.target.value.trim())}
        />
      </Form>
    ),
  });
});
