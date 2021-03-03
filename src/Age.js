

export function Age({ game, upp, career, display, onAged }) {
    if (display && game === 'classic') {
        return (
            <AgeCT
                upp={upp}
                career={career}
                onAged={onAged}
            />
        );
    } else {
        return (<div></div>)

    }
}

function AgeCT({ upp, career, onAged }) {
    onAged();

    return (<div></div>);
}