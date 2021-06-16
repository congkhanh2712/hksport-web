import styled from 'styled-components'

export const Container = styled.div`
    margin-top: 5px;
    padding: 30px 20px;
    padding-bottom: 10px;
    background: radial-gradient(circle, rgb(6, 184, 68) 0%, rgb(6, 184, 68) 0%);
`
//background: radial-gradient(circle, rgba(92, 39, 251,1) 0%, rgba(112, 71, 247, 1) 100%);

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1000px;
    margin: 0 auto;
`

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 60px;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  grid-gap: 20px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`

export const Link = styled.a`
  color: #fff;
  margin-bottom: 10px;
  font-size: 14px;
  text-decoration: none;
  &:hover {
      color: black;
      transition: 200ms ease-in;
      text-decoration: none;
  }
`

export const Title = styled.p`
  font-size: 20px;
  color: #fff;
  margin-bottom: 20px;
  font-family: "Times New Roman", Times, serif;
`