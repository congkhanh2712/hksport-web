import React from 'react'
import Footer from '../component/footer'
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';

export function FooterContainer() {
    return (
        <Footer>
            <Footer.Wrapper>
                <Footer.Row>
                    <Footer.Column>
                        <Footer.Title>Mạng Xã Hội</Footer.Title>
                        <Footer.Link target="_blank" href="https://www.facebook.com/minhhai2702"><FacebookIcon style={{ marginTop: -7, marginRight: 5 }} fontSize="small" />Facebook</Footer.Link>
                        <Footer.Link href=""><InstagramIcon style={{ marginTop: -7, marginRight: 5 }} fontSize="small" />Instagram</Footer.Link>
                    </Footer.Column>
                    <Footer.Column>
                        <Footer.Title>Thông tin liên hệ</Footer.Title>
                        <Footer.Link
                            href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=ngminhhai272@gmail.com&tf=1"
                            target="_blank"
                        >
                            <EmailIcon style={{ marginTop: -5, marginRight: 5 }} fontSize="small" />Email
                        </Footer.Link>
                        <Footer.Link href=""><PhoneIcon style={{ marginTop: -5, marginRight: 5 }} fontSize="small" />0969263550</Footer.Link>
                    </Footer.Column>
                    <Footer.Column>
                        <Footer.Title>Địa Chỉ</Footer.Title>
                        <Footer.Link href=""><LocationOnIcon style={{ marginTop: -5, marginRight: 5 }} fontSize="small" />
                            21/6 đường 11, phường Tăng Nhơn Phú B, Quận 9, TPHCM
                        </Footer.Link>
                    </Footer.Column>
                    <Footer.Column>
                        <Footer.Title>Đội ngũ phát triển</Footer.Title>
                        <Footer.Link href="">Nguyễn Công Khanh - 17110311</Footer.Link>
                        <Footer.Link href="">Nguyễn Minh Hải - 17110293</Footer.Link>
                    </Footer.Column>
                </Footer.Row>

            </Footer.Wrapper>
        </Footer>
    )
}