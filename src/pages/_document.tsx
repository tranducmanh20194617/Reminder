import Document, {DocumentContext, Head, Html, Main, NextScript} from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        return await Document.getInitialProps(ctx)
    }

    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <link rel="icon" type="image/png" sizes="32x32" href="/logoIcon.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/logoIcon.png"/>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                    <link rel="manifest" href="/site.webmanifest"/>
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                    <meta name="theme-color" content="#ffffff"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument
